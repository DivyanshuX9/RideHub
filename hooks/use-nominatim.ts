'use client';

import { useEffect, useRef, useState } from 'react';

export interface NominatimResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

export function useNominatim(query: string, enabled = true) {
  const [results, setResults] = useState<NominatimResult[]>([]);
  const [loading, setLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!enabled || query.trim().length < 3) {
      setResults([]);
      return;
    }

    // Debounce — Nominatim asks for max 1 req/sec
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      if (abortRef.current) abortRef.current.abort();
      abortRef.current = new AbortController();

      setLoading(true);
      try {
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=0&limit=6`;
        const res = await fetch(url, {
          signal: abortRef.current.signal,
          headers: { 'Accept-Language': 'en' },
        });
        const data: NominatimResult[] = await res.json();
        setResults(data);
      } catch (e: any) {
        if (e.name !== 'AbortError') setResults([]);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [query, enabled]);

  return { results, loading };
}

export async function reverseGeocode(lat: number, lon: number): Promise<string> {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
    { headers: { 'Accept-Language': 'en' } }
  );
  const data = await res.json();
  return data.display_name ?? `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
}
