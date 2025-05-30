'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { staggerElements } from '@/lib/animations';
import { motion } from 'framer-motion';
import { Bike, Bus, Car, Train, Zap } from 'lucide-react';
import { useEffect, useRef } from 'react';

const rideTypes = [
  {
    name: 'Car',
    icon: Car,
    description: 'Private rides with comfort',
    services: ['Uber', 'Ola', 'Lyft']
  },
  {
    name: 'Bus',
    icon: Bus,
    description: 'Economical public transport',
    services: ['City Bus', 'Shuttle']
  },
  {
    name: 'Train',
    icon: Train,
    description: 'Fast metro & rail services',
    services: ['Metro', 'Rail']
  },
  {
    name: 'Bike',
    icon: Bike,
    description: 'Quick two-wheeler rides',
    services: ['Rapido', 'Bike Share']
  },
  {
    name: 'Electric',
    icon: Zap,
    description: 'Eco-friendly options',
    services: ['Electric Cars', 'E-Bikes']
  }
];

export function RideOptions() {
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cardsElement = cardsRef.current;
  
    if (cardsElement) {
      const cardItems = Array.from(cardsElement.querySelectorAll('.card-item'));
  
      const observer = new IntersectionObserver(
        (entries, obs) => {
          const hasIntersected = entries.some((entry) => entry.isIntersecting);
  
          if (hasIntersected) {
            cardItems.forEach((item, index) => {
              staggerElements(item, index * 0.1);
            });
            obs.disconnect();
          }
        },
        { threshold: 0.1 }
      );
  
      observer.observe(cardsElement);
  
      return () => observer.disconnect();
    }
  }, []);
  

  return (
    <div
      ref={cardsRef}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6"
    >
      {rideTypes.map((type) => (
        <motion.div
          key={type.name}
          className="card-item"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ zIndex: 10 }}
          transition={{ duration: 0.2 }}
          style={{ zIndex: 1 }}
        >
          <Card className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow duration-300 h-full">
            <CardContent className="p-6 flex flex-col items-center text-center h-full">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <type.icon className="h-6 w-6 text-primary" />
              </div>

              <h3 className="font-semibold text-lg mb-2">{type.name}</h3>

              <p className="text-sm text-muted-foreground mb-4">
                {type.description}
              </p>

              <div className="text-xs text-muted-foreground mb-4">
                {type.services.join(' • ')}
              </div>

              <Button variant="outline" size="sm" className="w-full mt-auto">
                View Options
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
