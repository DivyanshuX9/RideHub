'use client';

import { useRef, useEffect, useState } from 'react';
import Map, { Marker, NavigationControl, Source, Layer } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { cn } from '@/lib/utils';

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

export function MapView({ from, to }: MapViewProps) {
  const mapRef = useRef(null);
  const [viewState, setViewState] = useState({
    longitude: -74.006,
    latitude: 40.7128,
    zoom: 12
  });
  
  const fromCoords = getMockCoordinates(from);
  const toCoords = getMockCoordinates(to);
  
  // Mock route data (GeoJSON)
  const routeData = {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'LineString',
      coordinates: [
        [fromCoords.lng, fromCoords.lat],
        [fromCoords.lng + 0.01, fromCoords.lat + 0.01],
        [toCoords.lng - 0.01, toCoords.lat - 0.01],
        [toCoords.lng, toCoords.lat]
      ]
    }
  };
  
  const routeLayer = {
    id: 'route',
    type: 'line',
    layout: {
      'line-join': 'round',
      'line-cap': 'round'
    },
    paint: {
      'line-color': 'hsl(var(--primary))',
      'line-width': 4,
      'line-opacity': 0.8
    }
  };
  
  useEffect(() => {
    // Center map to show both markers
    const midLat = (fromCoords.lat + toCoords.lat) / 2;
    const midLng = (fromCoords.lng + toCoords.lng) / 2;
    
    setViewState({
      longitude: midLng,
      latitude: midLat,
      zoom: 12
    });
  }, [from, to]);

  if (!process.env.NEXT_PUBLIC_MAPBOX_TOKEN) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-muted">
        <p className="text-muted-foreground">Please configure your Mapbox access token</p>
      </div>
    );
  }
  
  return (
    <div className={cn("h-full w-full relative")}>
      {/* @ts-ignore - The Mapbox GL typings might be incomplete */}
      <Map
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
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
        
        {/* @ts-ignore - The GeoJSON typings might be incomplete */}
        <Source id="route" type="geojson" data={routeData}>
          {/* @ts-ignore - The Layer typings might be incomplete */}
          <Layer {...routeLayer} />
        </Source>
      </Map>
      
      <div className="absolute bottom-4 left-4 right-4 bg-card/90 backdrop-blur-sm p-3 rounded-lg shadow-md border border-border text-xs">
        <div className="font-medium">Route Information</div>
        <div className="text-muted-foreground mt-1">
          Distance: ~{(Math.random() * 10 + 5).toFixed(1)} km • 
          Estimated time: {Math.floor(Math.random() * 30 + 15)} min
        </div>
      </div>
    </div>
  );
}