'use client';

import { useEffect, useRef, useState } from 'react';

export interface NominatimResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

export function useNominatim(query: string, enabled = true, userCoords?: { lat: number; lon: number }) {
  const [results, setResults] = useState<NominatimResult[]>([]);
  const [loading, setLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!enabled || query.trim().length < 3) {
      setResults([]);
      return;
    }

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      if (abortRef.current) abortRef.current.abort();
      abortRef.current = new AbortController();

      setLoading(true);
      try {
        // Bias results toward user's location when available
        const proximityParam = userCoords
          ? `&lat=${userCoords.lat}&lon=${userCoords.lon}`
          : '';
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=0&limit=10${proximityParam}`;
        const res = await fetch(url, {
          signal: abortRef.current.signal,
          headers: { 'Accept-Language': 'en' },
        });
        let data: NominatimResult[] = await res.json();
        // Sort by distance to user if coords available
        if (userCoords && data.length > 1) {
          data = data.sort((a, b) => {
            const distA = Math.hypot(parseFloat(a.lat) - userCoords.lat, parseFloat(a.lon) - userCoords.lon);
            const distB = Math.hypot(parseFloat(b.lat) - userCoords.lat, parseFloat(b.lon) - userCoords.lon);
            return distA - distB;
          }).slice(0, 6);
        }
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
  }, [query, enabled, userCoords?.lat, userCoords?.lon]);

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
