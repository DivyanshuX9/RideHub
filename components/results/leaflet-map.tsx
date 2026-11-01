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
  polyline?: [number, number][];
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

// HERE Flexible Polyline Decoding Table
const HERE_DECODING_TABLE = [
  62, -1, -1, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1,
  -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
  15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, 63,
  -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
  41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51,
];

function decodeFlexiblePolyline(encoded: string): [number, number][] {
  const result: [number, number][] = [];
  let index = 0;
  const length = encoded.length;

  function decodeUnsigned(): number | null {
    let res = 0;
    let shift = 0;
    let readAny = false;
    while (index < length) {
      const charCode = encoded.charCodeAt(index++) - 45;
      if (charCode < 0 || charCode >= HERE_DECODING_TABLE.length) return null;
      const val = HERE_DECODING_TABLE[charCode];
      if (val < 0) return null;
      readAny = true;
      res |= (val & 0x1f) << shift;
      if ((val & 0x20) === 0) return res;
      shift += 5;
    }
    return readAny ? res : null;
  }

  function toSigned(val: number): number {
    return (val & 1) ? ~(val >> 1) : (val >> 1);
  }

  if (index >= length) return result;
  const version = decodeUnsigned();
  if (version !== 1) return result;

  const headerVal = decodeUnsigned();
  if (headerVal === null) return result;
  const precision = headerVal & 15;
  const thirdDim = (headerVal >> 4) & 7;
  const factor = Math.pow(10, precision);
  const decPlaces = Math.max(5, precision);
  const rounder = Math.pow(10, decPlaces);

  let lastLat = 0;
  let lastLng = 0;

  while (index < length) {
    const rawLat = decodeUnsigned();
    if (rawLat === null) break;
    const rawLng = decodeUnsigned();
    if (rawLng === null) break;
    lastLat += toSigned(rawLat);
    lastLng += toSigned(rawLng);
    if (thirdDim) {
      decodeUnsigned();
    }
    result.push([
      Math.round((lastLat / factor) * rounder) / rounder,
      Math.round((lastLng / factor) * rounder) / rounder,
    ]);
  }

  return result;
}

// Client-side circuit breaker cooldown for rate-limited / exhausted providers
const clientCooldowns: Record<string, number> = {};
const CLIENT_COOLDOWN_MS = 60000;

function isClientOnCooldown(provider: string): boolean {
  return Date.now() < (clientCooldowns[provider] || 0);
}

function markClientExhausted(provider: string) {
  clientCooldowns[provider] = Date.now() + CLIENT_COOLDOWN_MS;
}

function clearClientCooldown(provider: string) {
  delete clientCooldowns[provider];
}

// OSRM hosts to try in order — fallback if one resets
const OSRM_HOSTS = [
  'https://router.project-osrm.org',
  'https://routing.openstreetmap.de',
];

interface RouteResult {
  coords: [number, number][];
  distanceKm: number;
  durationMin: number;
}

async function fetchTomTomClientRoute(posA: [number, number], posB: [number, number]): Promise<RouteResult | null> {
  const tomtomKey = process.env.NEXT_PUBLIC_TOMTOM_API_KEY || '';
  if (!tomtomKey || isClientOnCooldown('tomtom')) return null;

  try {
    const url = `https://api.tomtom.com/routing/1/calculateRoute/${posA[0]},${posA[1]}:${posB[0]},${posB[1]}/json?key=${tomtomKey}&traffic=false&travelMode=car`;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timer);

    if (res.ok) {
      const data = await res.json();
      const route = data?.routes?.[0];
      if (route) {
        const coords: [number, number][] = [];
        for (const leg of route.legs || []) {
          for (const pt of leg.points || []) {
            coords.push([pt.latitude, pt.longitude]);
          }
        }
        if (coords.length > 0) {
          clearClientCooldown('tomtom');
          return {
            coords,
            distanceKm: parseFloat(((route.summary?.lengthInMeters || 0) / 1000).toFixed(1)),
            durationMin: Math.max(1, Math.round((route.summary?.travelTimeInSeconds || 0) / 60)),
          };
        }
      }
    } else if ([429, 403, 401, 402].includes(res.status)) {
      markClientExhausted('tomtom');
    }
  } catch {
    // TomTom network / timeout error
  }
  return null;
}

async function fetchHereClientRoute(posA: [number, number], posB: [number, number]): Promise<RouteResult | null> {
  const hereKey = process.env.NEXT_PUBLIC_HERE_API_KEY || '';
  if (!hereKey || isClientOnCooldown('here')) return null;

  try {
    const url = `https://router.hereapi.com/v8/routes?transportMode=car&origin=${posA[0]},${posA[1]}&destination=${posB[0]},${posB[1]}&return=summary,polyline&apiKey=${hereKey}`;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timer);

    if (res.ok) {
      const data = await res.json();
      const route = data?.routes?.[0];
      if (route?.sections?.length) {
        let totalLength = 0;
        let totalDuration = 0;
        const coords: [number, number][] = [];
        for (const s of route.sections) {
          totalLength += s.summary?.length || 0;
          totalDuration += s.summary?.duration || 0;
          if (s.polyline) {
            coords.push(...decodeFlexiblePolyline(s.polyline));
          }
        }
        if (coords.length > 0) {
          clearClientCooldown('here');
          return {
            coords,
            distanceKm: parseFloat((totalLength / 1000).toFixed(1)),
            durationMin: Math.max(1, Math.round(totalDuration / 60)),
          };
        }
      }
    } else if ([429, 403, 401, 402].includes(res.status)) {
      markClientExhausted('here');
    }
  } catch {
    // HERE network / timeout error
  }
  return null;
}

async function fetchOsrmClientRoute(posA: [number, number], posB: [number, number]): Promise<RouteResult | null> {
  if (isClientOnCooldown('osrm')) return null;

  let allExhausted = true;
  for (const host of OSRM_HOSTS) {
    try {
      const url =
        `${host}/route/v1/driving/` +
        `${posA[1]},${posA[0]};${posB[1]},${posB[0]}` +
        `?overview=full&geometries=geojson`;

      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 6000);
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timer);

      if (res.ok) {
        const data = await res.json();
        if (data.code === 'Ok' && data.routes?.[0]) {
          const route = data.routes[0];
          const coords: [number, number][] = route.geometry.coordinates.map(
            ([lon, lat]: [number, number]) => [lat, lon]
          );
          clearClientCooldown('osrm');
          return {
            coords,
            distanceKm: parseFloat((route.distance / 1000).toFixed(1)),
            durationMin: Math.max(1, Math.round(route.duration / 60)),
          };
        }
      } else if (res.status === 429 || res.status === 503) {
        continue;
      } else {
        allExhausted = false;
      }
    } catch {
      continue;
    }
  }
  if (allExhausted) {
    markClientExhausted('osrm');
  }
  return null;
}

function getClientRoutingOrder(): string[] {
  const raw = process.env.NEXT_PUBLIC_ROUTING_PROVIDER_ORDER || 'tomtom,here,osrm';
  const list = raw.split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
  for (const fb of ['tomtom', 'here', 'osrm']) {
    if (!list.includes(fb)) list.push(fb);
  }
  return list;
}

async function fetchRoadRoute(
  posA: [number, number],
  posB: [number, number]
): Promise<RouteResult | null> {
  const order = getClientRoutingOrder();
  for (const p of order) {
    if (p === 'tomtom') {
      const r = await fetchTomTomClientRoute(posA, posB);
      if (r) return r;
    } else if (p === 'here') {
      const r = await fetchHereClientRoute(posA, posB);
      if (r) return r;
    } else if (p === 'osrm') {
      const r = await fetchOsrmClientRoute(posA, posB);
      if (r) return r;
    }
  }
  return null;
}

export default function LeafletMap({ from, to, fromLat, fromLon, toLat, toLon, polyline }: Props) {
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

      // 1. If backend provided route polyline (from Google Maps or OSRM), render it directly
      if (polyline && polyline.length >= 2) {
        L.polyline(polyline, { color: '#2563eb', weight: 5, opacity: 0.9 }).addTo(map);
        map.fitBounds(polyline, { padding: [50, 50] });
        return;
      }

      // 2. Otherwise fetch road route as client fallback
      const route = await fetchRoadRoute(posA, posB);

      if (!alive()) return;

      if (route) {
        L.polyline(route.coords, { color: '#2563eb', weight: 5, opacity: 0.9 }).addTo(map);
        map.fitBounds(route.coords, { padding: [50, 50] });
      } else {
        // 3. Straight dashed connection fallback
        L.polyline([posA, posB], { color: '#2563eb', weight: 4, dashArray: '8 6' }).addTo(map);
        map.fitBounds([posA, posB], { padding: [60, 60] });
      }
    }

    init();

    return () => {
      cancelled = true;
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }
    };
  }, [from, to, fromLat, fromLon, toLat, toLon, polyline]);

  return <div ref={containerRef} style={{ height: '100%', width: '100%' }} />;
}
