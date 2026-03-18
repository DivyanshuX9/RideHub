'use client';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useRef } from 'react';

interface Props {
  from: string;
  to: string;
  fromLat: string;
  fromLon: string;
  toLat: string;
  toLon: string;
}

const pinA = L.divIcon({
  html: `<div style="background:hsl(221,83%,53%);color:#fff;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:13px;box-shadow:0 2px 6px rgba(0,0,0,.35)">A</div>`,
  className: '', iconSize: [28, 28], iconAnchor: [14, 28],
});
const pinB = L.divIcon({
  html: `<div style="background:hsl(0,72%,51%);color:#fff;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:13px;box-shadow:0 2px 6px rgba(0,0,0,.35)">B</div>`,
  className: '', iconSize: [28, 28], iconAnchor: [14, 28],
});

async function geocode(query: string): Promise<[number, number]> {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`,
    { headers: { 'Accept-Language': 'en' } }
  );
  const data = await res.json();
  if (data?.[0]) return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
  return [20.5937, 78.9629];
}

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';

export default function LeafletMap({ from, to, fromLat, fromLon, toLat, toLon }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }

    let cancelled = false;

    async function init() {
      const posA: [number, number] =
        fromLat && fromLon ? [parseFloat(fromLat), parseFloat(fromLon)] : await geocode(from || 'India');
      const posB: [number, number] =
        toLat && toLon ? [parseFloat(toLat), parseFloat(toLon)] : await geocode(to || 'India');

      if (cancelled || !containerRef.current) return;

      const map = L.map(containerRef.current, { zoomControl: true }).setView(posA, 13);
      mapRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      L.marker(posA, { icon: pinA }).addTo(map).bindPopup(from);
      L.marker(posB, { icon: pinB }).addTo(map).bindPopup(to);

      // Fetch real road route from backend
      try {
        const res = await fetch(`${API}/route/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            from_lat: posA[0], from_lon: posA[1],
            to_lat: posB[0],   to_lon: posB[1],
            from_name: from,   to_name: to,
          }),
        });
        const data = await res.json();

        if (!cancelled && data.polyline?.length) {
          const latlngs: [number, number][] = data.polyline.map(([lat, lon]: number[]) => [lat, lon]);
          L.polyline(latlngs, { color: '#2563eb', weight: 5, opacity: 0.85 }).addTo(map);
          map.fitBounds(latlngs, { padding: [50, 50] });

          // Info bar
          const info = document.createElement('div');
          info.style.cssText =
            'position:absolute;bottom:52px;left:12px;right:12px;z-index:1000;background:rgba(255,255,255,0.93);backdrop-filter:blur(4px);padding:8px 12px;border-radius:8px;border:1px solid #e2e8f0;font-size:12px;pointer-events:none;';
          info.innerHTML = `<span style="font-weight:600">Road distance:</span> ${data.distance_km} km &nbsp;|&nbsp; <span style="font-weight:600">ETA:</span> ~${data.duration_min} min`;
          containerRef.current!.style.position = 'relative';
          containerRef.current!.appendChild(info);
        }
      } catch {
        // backend not running — fallback dashed line
        L.polyline([posA, posB], { color: '#2563eb', weight: 4, dashArray: '8 6' }).addTo(map);
        map.fitBounds([posA, posB], { padding: [60, 60] });
      }
    }

    init();
    return () => {
      cancelled = true;
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }
    };
  }, [from, to, fromLat, fromLon, toLat, toLon]);

  return <div ref={containerRef} style={{ height: '100%', width: '100%' }} />;
}
