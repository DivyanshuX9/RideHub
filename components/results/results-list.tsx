'use client';

import { useAuth } from '@/components/auth/auth-context';
import { OlaLogo } from '@/components/logos/OlaLogo';
import { RapidoLogo } from '@/components/logos/RapidoLogo';
import { UberLogo } from '@/components/logos/UberLogo';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { filterRideOptions } from '@/lib/mock-data';
import { AnimatePresence, motion } from 'framer-motion';
import { Bus, Car, Clock, IndianRupee, Train, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';

interface RideOption {
  id: string; service: string; type: string;
  estimated_time: number; estimated_price: number;
  distance: number; eco_friendly: boolean; is_public: boolean;
}

interface ResultsListProps {
  filter: 'fastest' | 'cheapest' | 'eco' | 'public';
  rides?: RideOption[];
  distanceKm?: number;
  isInterstate?: boolean;
  from?: string;
  to?: string;
}

function getServiceIcon(service: string) {
  switch (service.toLowerCase()) {
    case 'uber':   return <UberLogo className="h-12 w-12" />;
    case 'ola':    return <OlaLogo className="h-10 w-10" />;
    case 'rapido': return <RapidoLogo className="h-12 w-12" />;
    case 'metro':  return <Train className="h-8 w-8 text-blue-500" />;
    case 'bus':    return <Bus className="h-8 w-8 text-blue-500" />;
    default:       return <Car className="h-8 w-8" />;
  }
}

function applyFilter(rides: RideOption[], filter: string): RideOption[] {
  switch (filter) {
    case 'fastest':  return [...rides].filter(r => !r.is_public).sort((a, b) => a.estimated_time - b.estimated_time);
    case 'cheapest': return [...rides].filter(r => !r.is_public).sort((a, b) => a.estimated_price - b.estimated_price);
    case 'eco':      return rides.filter(r => r.eco_friendly && !r.is_public);
    case 'public':   return rides.filter(r => r.is_public);
    default:         return rides;
  }
}

// Fallback mock rides when backend is offline
function getMockRides(distanceKm?: number): RideOption[] {
  return filterRideOptions('fastest').map(o => ({
    id: o.id,
    service: o.service,
    type: o.type,
    estimated_time: distanceKm ? Math.round((distanceKm / 40) * 60) : o.estimatedTime,
    estimated_price: distanceKm ? parseFloat((o.estimatedPrice + distanceKm * 0.5).toFixed(2)) : o.estimatedPrice,
    distance: distanceKm ?? o.distance,
    eco_friendly: o.ecoFriendly,
    is_public: ['Bus', 'Metro'].includes(o.service),
  }));
}

export function ResultsList({ filter, rides, distanceKm, isInterstate = false, from = '', to = '' }: ResultsListProps) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setIsLoading(true);
    const t = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(t);
  }, [filter, rides]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32 w-full mb-2" />)}
      </div>
    );
  }

  // Interstate: no public transport
  if (filter === 'public' && isInterstate) {
    return (
      <Card className="border-dashed">
        <CardContent className="p-8 flex flex-col items-center justify-center text-center gap-3">
          <Bus className="h-10 w-10 text-muted-foreground" />
          <p className="font-semibold">No public transport available</p>
          <p className="text-sm text-muted-foreground">Bus and Metro are not available for inter-state routes. Please choose a cab or bike.</p>
        </CardContent>
      </Card>
    );
  }

  const source = rides && rides.length > 0 ? rides : getMockRides(distanceKm);
  const filtered = applyFilter(source, filter);

  if (filtered.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="p-6 flex flex-col items-center justify-center text-center gap-3">
          <p className="text-muted-foreground">No ride options found for this filter.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <AnimatePresence mode="wait">
        <motion.div key={filter} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          {filtered.map((option, index) => (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.25, delay: index * 0.07 }}
              whileHover={{ scale: 1.005 }}
              className="mb-3"
            >
              <Card className={`overflow-hidden shadow-sm hover:shadow-md transition-shadow ${option.is_public ? 'border-l-4 border-blue-500' : ''}`}>
                <CardContent className="p-0">
                  <div className="grid grid-cols-1 md:grid-cols-4">
                    <div className="bg-primary/5 p-4 flex items-center justify-center md:border-r border-border">
                      <div className="flex flex-col items-center text-center">
                        {getServiceIcon(option.service)}
                        <div className="text-xs text-muted-foreground mt-1">{option.type}</div>
                      </div>
                    </div>

                    <div className="col-span-2 p-4 space-y-3">
                      <div className="flex items-center flex-wrap gap-3">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 text-muted-foreground mr-1" />
                          <span className="text-sm">{option.estimated_time} min</span>
                        </div>
                        <div className="flex items-center">
                          <IndianRupee className="h-4 w-4 text-muted-foreground mr-1" />
                          <span className="text-sm">{option.estimated_price.toFixed(0)}</span>
                        </div>
                        {option.eco_friendly && (
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Zap className="h-3 w-3" /> Eco
                          </Badge>
                        )}
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm text-muted-foreground">{option.distance.toFixed(1)} km road distance</div>
                        {filter === 'fastest'  && index === 0 && <Badge variant="secondary">Fastest Option</Badge>}
                        {filter === 'cheapest' && index === 0 && <Badge variant="secondary">Best Value</Badge>}
                      </div>
                    </div>

                    <div className="bg-card p-4 flex flex-col justify-center items-center md:items-end gap-2 border-t md:border-t-0 md:border-l border-border">
                      <div className="text-lg font-semibold flex items-center">
                        <IndianRupee className="h-4 w-4" />{option.estimated_price.toFixed(0)}
                      </div>
                      <Button
                        size="sm"
                        onClick={async () => {
                          if (!user?.id || !user?.sessionToken) return;
                          await fetch(`${API}/bookings/`, {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                              'X-User-Id': user.id,
                            },
                            body: JSON.stringify({
                              user_id: user.id,
                              from_location: from,
                              to_location: to,
                              service: option.service,
                              ride_type: option.type,
                              price: option.estimated_price,
                              distance: option.distance,
                              duration: option.estimated_time,
                              status: 'scheduled',
                            }),
                          });
                        }}
                      >
                        Book Now
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
