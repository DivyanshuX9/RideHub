'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookingsList } from '@/components/bookings/bookings-list';
import { BookingDetails } from '@/components/bookings/booking-details';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Booking } from '@/types/booking';

export default function BookingsPage() {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  
  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-2xl font-bold">Your Bookings</h1>
          <p className="text-muted-foreground">
            View and manage your past and upcoming rides
          </p>
        </motion.div>
        
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past Rides</TabsTrigger>
            <TabsTrigger value="canceled">Canceled</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming">
            <BookingsList 
              type="upcoming" 
              onSelectBooking={setSelectedBooking} 
            />
          </TabsContent>
          
          <TabsContent value="past">
            <BookingsList 
              type="past" 
              onSelectBooking={setSelectedBooking} 
            />
          </TabsContent>
          
          <TabsContent value="canceled">
            <BookingsList 
              type="canceled" 
              onSelectBooking={setSelectedBooking} 
            />
          </TabsContent>
        </Tabs>
        
        <AnimatePresence>
          {selectedBooking && (
            <BookingDetails 
              booking={selectedBooking} 
              onClose={() => setSelectedBooking(null)} 
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}