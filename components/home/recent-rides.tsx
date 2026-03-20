'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getIconByName } from '@/lib/mock-data';
import { useAuth } from '@/components/auth/auth-context';
import { Booking } from '@/types/booking';
import { MapPin, Calendar, Clock } from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';

export function RecentRides() {
  const { user } = useAuth();
  const [rides, setRides] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) { setLoading(false); return; }
    fetch(`${API}/bookings/${user.id}`)
      .then(r => r.json())
      .then((data: Booking[]) => setRides(data.filter(b => b.status === 'completed').slice(0, 3)))
      .catch(() => setRides([]))
      .finally(() => setLoading(false));
  }, [user?.id]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2].map(i => (
          <Card key={i}><CardContent className="p-4"><div className="h-12 bg-muted animate-pulse rounded" /></CardContent></Card>
        ))}
      </div>
    );
  }

  if (rides.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-4">
          <p className="text-muted-foreground">You haven&apos;t taken any rides yet.</p>
          <Button variant="outline">Book Your First Ride</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {rides.map((ride) => (
        <Card key={ride.id} className="overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-0">
            <div className="grid grid-cols-1 md:grid-cols-4">
              <div className="bg-primary/5 p-4 flex items-center justify-center md:border-r border-border">
                <div className="flex flex-col items-center text-center">
                  {getIconByName(ride.service)}
                  <div className="text-xs text-muted-foreground">{ride.distance} km</div>
                </div>
              </div>
              <div className="col-span-2 p-4 space-y-3">
                <div className="flex items-start space-x-2">
                  <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <div className="text-sm font-medium">From: {ride.from_location}</div>
                    <div className="text-sm font-medium">To: {ride.to_location}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs">{ride.date}</span>
                  <Clock className="h-4 w-4 text-muted-foreground ml-2" />
                  <span className="text-xs">{ride.time}</span>
                </div>
              </div>
              <div className="bg-card p-4 flex flex-col justify-center items-center md:items-end space-y-2 border-t md:border-t-0 md:border-l border-border">
                <div className="text-lg font-semibold">₹{ride.price.toFixed(0)}</div>
                <Button variant="outline" size="sm">Book Again</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      <div className="flex justify-center pt-4">
        <Button variant="outline">View All Rides</Button>
      </div>
    </div>
  );
}
