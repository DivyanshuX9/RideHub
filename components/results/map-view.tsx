'use client';

import { MapPin } from 'lucide-react';
import dynamic from 'next/dynamic';

interface MapViewProps {
  from: string;
  to: string;
  fromLat?: string;
  fromLon?: string;
  toLat?: string;
  toLon?: string;
}

const LeafletMap = dynamic(() => import('./leaflet-map'), { ssr: false });

export function MapView({ from, to, fromLat = '', fromLon = '', toLat = '', toLon = '' }: MapViewProps) {
  return (
    <div className="h-full w-full relative rounded-xl overflow-hidden border border-border">
      <LeafletMap
        from={from} to={to}
        fromLat={fromLat} fromLon={fromLon}
        toLat={toLat} toLon={toLon}
      />
      <div className="absolute bottom-4 left-4 right-4 z-[1000] bg-card/90 backdrop-blur-sm p-3 rounded-lg shadow border border-border text-xs flex items-center gap-2 pointer-events-none">
        <MapPin className="h-4 w-4 text-primary shrink-0" />
        <span className="text-muted-foreground truncate">{from} → {to}</span>
      </div>
    </div>
  );
}
