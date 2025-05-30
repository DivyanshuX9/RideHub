'use client';

import { Button } from '@/components/ui/button';
import { getIconByName } from '@/lib/mock-data';
import { Booking } from '@/types/booking';
import { motion } from 'framer-motion';
import { Calendar, Car, Clock, MapPin, Star, User, X } from 'lucide-react';

interface BookingDetailsProps {
  booking: Booking;
  onClose: () => void;
}

export function BookingDetails({ booking, onClose }: BookingDetailsProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="bg-card shadow-lg rounded-lg border overflow-hidden w-full max-w-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-2">
            {getIconByName(booking.service === 'uber' || booking.service === 'ola' ? 'car-front' : booking.service)}
            <h2 className="text-lg font-semibold capitalize">
              {booking.service} {booking.status === 'scheduled' ? 'Booking' : 'Ride'}
            </h2>
          </div>
          
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">From</div>
                <div className="flex items-start space-x-2">
                  <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="font-medium">{booking.from}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">To</div>
                <div className="flex items-start space-x-2">
                  <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="font-medium">{booking.to}</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Date & Time</div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    <span>{booking.date}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-primary" />
                    <span>{booking.time}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Ride Info</div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {getIconByName(booking.service === 'uber' || booking.service === 'ola' ? 'car-front' : booking.service)}
                    <span>{booking.distance} km</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-primary" />
                    <span>{booking.duration} min</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {booking.driverName && booking.vehicleDetails && (
            <div className="pt-2 border-t">
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground">Driver & Vehicle</div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    
                    <div>
                      <div className="font-medium">{booking.driverName}</div>
                      {booking.driverRating && (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Star className="h-3 w-3 text-yellow-500 mr-1 fill-yellow-500" />
                          {booking.driverRating}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Car className="h-6 w-6 text-primary" />
                    </div>
                    
                    <div className="text-sm">
                      {booking.vehicleDetails}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div className="pt-2 border-t">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">Total Price</div>
                <div className="text-2xl font-bold">${booking.price.toFixed(2)}</div>
              </div>
              
              <div className="space-x-2">
                {booking.status === 'scheduled' && (
                  <Button variant="destructive" size="sm">
                    Cancel Booking
                  </Button>
                )}
                
                {booking.status === 'completed' && (
                  <Button variant="outline" size="sm">
                    Book Again
                  </Button>
                )}
                
                {booking.status === 'canceled' && (
                  <Button size="sm">
                    Rebook
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}