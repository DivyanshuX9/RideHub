'use client';

import { cn } from '@/lib/utils';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useEffect, useRef, useState } from 'react';
import Map, { Layer, Marker, NavigationControl, Source } from 'react-map-gl';

interface MapViewProps {
  from: string;
  to: string;
}

// Function to get mock coordinates based on location names
const getMockCoordinates = (location: string) => {
  // Just using some made-up coordinates for demo
  const baseCoords = { lat: 40.7128, lng: -74.006 };
  
  // Generate slight variations based on string hash
  const hash = location.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  return {
    lat: baseCoords.lat + (hash % 10) * 0.01,
    lng: baseCoords.lng + (hash % 10) * 0.01,
  };
};

const MAPTILER_API_KEY = process.env.NEXT_PUBLIC_MAPTILER_API_KEY;
const MAPTILER_STYLE = MAPTILER_API_KEY ? `https://api.maptiler.com/maps/streets/style.json?key=${MAPTILER_API_KEY}` : undefined;

export function MapView({ from, to }: MapViewProps) {
  const mapRef = useRef(null);
  const [viewState, setViewState] = useState({
    longitude: -74.006,
    latitude: 40.7128,
    zoom: 12
  });
  
  const fromCoords = getMockCoordinates(from);
  const toCoords = getMockCoordinates(to);
  
  const [routeGeoJSON, setRouteGeoJSON] = useState<any>(null);
  const [loadingRoute, setLoadingRoute] = useState(false);
  const [distance, setDistance] = useState<number | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  
  const routeLayer = {
    id: 'route',
    type: 'line',
    layout: {
      'line-join': 'round',
      'line-cap': 'round'
    },
    paint: {
      'line-color': '#2563eb',
      'line-width': 4,
      'line-opacity': 0.8
    }
  };
  
  useEffect(() => {
    async function fetchRoute() {
      setLoadingRoute(true);
      const url = `https://api.maptiler.com/directions/v2/route/driving/${fromCoords.lng},${fromCoords.lat};${toCoords.lng},${toCoords.lat}?key=${MAPTILER_API_KEY}&geometries=geojson`;
      try {
        const res = await fetch(url);
        const data = await res.json();
        if (data && data.routes && data.routes[0] && data.routes[0].geometry) {
          setRouteGeoJSON({
            type: 'Feature',
            properties: {},
            geometry: data.routes[0].geometry
          });
          setDistance(data.routes[0].distance); // in meters
          setDuration(data.routes[0].duration); // in seconds
        } else {
          setRouteGeoJSON(null);
          setDistance(null);
          setDuration(null);
        }
      } catch (e) {
        setRouteGeoJSON(null);
        setDistance(null);
        setDuration(null);
      }
      setLoadingRoute(false);
    }
    fetchRoute();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [from, to]);

  if (!MAPTILER_API_KEY) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-muted">
        <p className="text-muted-foreground">Please configure your MapTiler access key</p>
      </div>
    );
  }
  
  return (
    <div className={cn("h-full w-full relative")}>
      {/* @ts-ignore - The Mapbox GL typings might be incomplete */}
      <Map
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        mapStyle={MAPTILER_STYLE}
        mapboxAccessToken={MAPTILER_API_KEY}
        ref={mapRef}
        attributionControl={false}
      >
        <NavigationControl position="top-right" />
        
        <Marker
          longitude={fromCoords.lng}
          latitude={fromCoords.lat}
          anchor="bottom"
        >
          <div className="h-6 w-6 bg-primary rounded-full flex items-center justify-center text-white text-xs">A</div>
        </Marker>
        
        <Marker
          longitude={toCoords.lng}
          latitude={toCoords.lat}
          anchor="bottom"
        >
          <div className="h-6 w-6 bg-primary rounded-full flex items-center justify-center text-white text-xs">B</div>
        </Marker>
        
        {/* Show route if loaded */}
        {routeGeoJSON && !loadingRoute && (
          <Source id="route" type="geojson" data={routeGeoJSON}>
            <Layer {...(routeLayer as any)} />
          </Source>
        )}
      </Map>
      
      {/* Loading spinner for route */}
      {loadingRoute && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-background/80 rounded-lg p-4 flex flex-col items-center">
            <svg className="animate-spin h-8 w-8 text-primary mb-2" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            <span className="text-primary font-medium">Fetching route...</span>
          </div>
        </div>
      )}
      
      <div className="absolute bottom-4 left-4 right-4 bg-card/90 backdrop-blur-sm p-3 rounded-lg shadow-md border border-border text-xs">
        <div className="font-medium">Route Information</div>
        <div className="text-muted-foreground mt-1">
          {distance !== null && duration !== null ? (
            <>
              Distance: ~{(distance / 1000).toFixed(1)} km • Estimated time: {Math.round(duration / 60)} min
            </>
          ) : (
            <>Distance and time unavailable</>
          )}
        </div>
      </div>
      
      {/* Attribution for MapTiler */}
      <div className="absolute bottom-0 right-0 bg-white/80 text-xs px-2 py-1 rounded-tl">© <a href="https://www.maptiler.com/copyright/" target="_blank" rel="noopener noreferrer">MapTiler</a> © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap contributors</a></div>
    </div>
  );
}