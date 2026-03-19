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
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`,
      { headers: { 'Accept-Language': 'en' } }
    );
    const data = await res.json();
    if (data?.[0]) return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
  } catch { /* ignore */ }
  return [20.5937, 78.9629];
}

// OSRM hosts to try in order — fallback if one resets
const OSRM_HOSTS = [
  'https://router.project-osrm.org',
  'https://routing.openstreetmap.de',
];

async function fetchRoadRoute(
  posA: [number, number],
  posB: [number, number]
): Promise<{ coords: [number, number][]; distanceKm: number; durationMin: number } | null> {
  for (const host of OSRM_HOSTS) {
    try {
      const url =
        `${host}/route/v1/driving/` +
        `${posA[1]},${posA[0]};${posB[1]},${posB[0]}` +
        `?overview=full&geometries=geojson`;

      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 8000); // 8s timeout

      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timer);

      const data = await res.json();
      if (data.code !== 'Ok' || !data.routes?.[0]) continue;

      const route = data.routes[0];
      const coords: [number, number][] = route.geometry.coordinates.map(
        ([lon, lat]: [number, number]) => [lat, lon]
      );

      return {
        coords,
        distanceKm: parseFloat((route.distance / 1000).toFixed(1)),
        durationMin: Math.max(1, Math.round(route.duration / 60)),
      };
    } catch {
      continue; // try next host
    }
  }
  return null; // all hosts failed — caller draws straight line fallback
}

export default function LeafletMap({ from, to, fromLat, fromLon, toLat, toLon }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }

    let cancelled = false;
    const alive = () => !cancelled && containerRef.current !== null;

    async function init() {
      const posA: [number, number] =
        fromLat && fromLon
          ? [parseFloat(fromLat), parseFloat(fromLon)]
          : await geocode(from || 'India');

      const posB: [number, number] =
        toLat && toLon
          ? [parseFloat(toLat), parseFloat(toLon)]
          : await geocode(to || 'India');

      if (!alive()) return;

      const container = containerRef.current!;
      const map = L.map(container, { zoomControl: true }).setView(posA, 13);
      mapRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      L.marker(posA, { icon: pinA }).addTo(map).bindPopup(from);
      L.marker(posB, { icon: pinB }).addTo(map).bindPopup(to);

      // Fetch real road route from OSRM directly
      const route = await fetchRoadRoute(posA, posB);

      if (!alive()) return;

      if (route) {
        L.polyline(route.coords, { color: '#2563eb', weight: 5, opacity: 0.9 }).addTo(map);
        map.fitBounds(route.coords, { padding: [50, 50] });

        if (alive()) {
          const info = document.createElement('div');
          info.style.cssText =
            'position:absolute;bottom:52px;left:12px;right:12px;z-index:1000;' +
            'background:rgba(255,255,255,0.93);backdrop-filter:blur(4px);' +
            'padding:8px 12px;border-radius:8px;border:1px solid #e2e8f0;' +
            'font-size:12px;pointer-events:none;';
          info.innerHTML =
            `<span style="font-weight:600">Road distance:</span> ${route.distanceKm} km` +
            ` &nbsp;|&nbsp; <span style="font-weight:600">ETA:</span> ~${route.durationMin} min`;
          container.style.position = 'relative';
          container.appendChild(info);
        }
      } else {
        // OSRM unavailable — straight dashed fallback
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
