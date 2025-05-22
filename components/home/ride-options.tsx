'use client';

import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Car, Bus, Train, Bike, Zap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { staggerElements } from '@/lib/animations';

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
      const cardItems = cardsElement.querySelectorAll('.card-item');
      
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            staggerElements(cardItems, 0.1);
            observer.disconnect();
          }
        },
        { threshold: 0.1 }
      );
      
      observer.observe(cardsElement);
      
      return () => {
        observer.disconnect();
      };
    }
  }, []);
  
  return (
    <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
      {rideTypes.map((type, index) => (
        <Card 
          key={type.name}
          className="card-item overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow duration-300"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.2 }}
          >
            <CardContent className="p-6 flex flex-col items-center text-center">
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
              
              <Button variant="outline" size="sm" className="w-full">
                View Options
              </Button>
            </CardContent>
          </motion.div>
        </Card>
      ))}
    </div>
  );
}