'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getBookingsByType, getIconByName } from '@/lib/mock-data';
import { Booking, BookingType } from '@/types/booking';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, Calendar, Clock, MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';

interface BookingsListProps {
  type: BookingType;
  onSelectBooking: (booking: Booking) => void;
}

export function BookingsList({ type, onSelectBooking }: BookingsListProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      const fetchedBookings = getBookingsByType(type);
      setBookings(fetchedBookings);
      setLoading(false);
    }, 500);
  }, [type]);
  
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-4">
                <div className="p-4 flex items-center justify-center">
                  <div className="h-12 w-12 rounded-full bg-muted animate-pulse" />
                </div>
                <div className="col-span-2 p-4 space-y-3">
                  <div className="w-3/4 h-4 bg-muted animate-pulse rounded" />
                  <div className="w-1/2 h-4 bg-muted animate-pulse rounded" />
                </div>
                <div className="p-4 flex flex-col justify-center items-center md:items-end space-y-2">
                  <div className="w-16 h-6 bg-muted animate-pulse rounded" />
                  <div className="w-24 h-8 bg-muted animate-pulse rounded" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
  
  if (bookings.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-4">
          <AlertTriangle className="h-10 w-10 text-muted-foreground" />
          <p className="text-muted-foreground">No {type} bookings found.</p>
          {type === 'upcoming' && (
            <Button variant="outline">Book a Ride</Button>
          )}
        </CardContent>
      </Card>
    );
  }
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={type}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="space-y-4"
      >
        {bookings.map((booking, index) => {
          return (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                transition: { delay: index * 0.05 }
              }}
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
            >
              <Card 
                className="overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer"
                onClick={() => onSelectBooking(booking)}
              >
                <CardContent className="p-0">
                  <div className="grid grid-cols-1 md:grid-cols-4">
                    <div className="bg-primary/5 p-4 flex items-center justify-center md:border-r border-border">
                      <div className="flex flex-col items-center text-center">
                        {getIconByName(booking.service === 'uber' || booking.service === 'ola' ? 'car-front' : booking.service)}
                        <div className="text-sm font-medium capitalize">
                          {booking.service}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {booking.distance} km
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-span-2 p-4 space-y-3">
                      <div className="flex items-start space-x-2">
                        <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                        <div className="space-y-1 flex-1">
                          <div className="text-sm font-medium">From: {booking.from}</div>
                          <div className="text-sm font-medium">To: {booking.to}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs">{booking.date}</span>
                        
                        <Clock className="h-4 w-4 text-muted-foreground ml-2" />
                        <span className="text-xs">{booking.time}</span>
                      </div>
                    </div>
                    
                    <div className="bg-card p-4 flex flex-col justify-center items-center md:items-end space-y-2 border-t md:border-t-0 md:border-l border-border">
                      <div className="text-lg font-semibold">
                        ${booking.price.toFixed(2)}
                      </div>
                      
                      {type === 'upcoming' && (
                        <Button variant="outline" size="sm">
                          Cancel
                        </Button>
                      )}
                      
                      {type === 'past' && (
                        <Button variant="outline" size="sm">
                          Book Again
                        </Button>
                      )}
                      
                      {type === 'canceled' && (
                        <Button variant="outline" size="sm">
                          Rebook
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>
    </AnimatePresence>
  );
}