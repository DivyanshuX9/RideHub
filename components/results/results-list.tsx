'use client';

import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, Clock, DollarSign, Car, Bus, Train, Bike } from 'lucide-react';
import { filterRideOptions } from '@/lib/mock-data';
import { staggerElements } from '@/lib/animations';

interface ResultsListProps {
  filter: 'fastest' | 'cheapest' | 'eco';
}

export function ResultsList({ filter }: ResultsListProps) {
  const resultsRef = useRef<HTMLDivElement>(null);
  const filteredOptions = filterRideOptions(filter);

  useEffect(() => {
    const resultsElement = resultsRef.current;

    if (resultsElement) {
      const resultItems = Array.from(resultsElement.querySelectorAll('.result-item'));
      resultItems.forEach((item, index) => {
        staggerElements(item, index * 0.1); // Apply animation staggered
      });
    }
  }, [filter]);

  const getServiceIcon = (service: string) => {
    switch (service.toLowerCase()) {
      case 'uber':
      case 'ola':
        return <Car className="h-5 w-5" />;
      case 'metro':
        return <Train className="h-5 w-5" />;
      case 'bus':
        return <Bus className="h-5 w-5" />;
      case 'rapido':
        return <Bike className="h-5 w-5" />;
      default:
        return <Car className="h-5 w-5" />;
    }
  };

  if (filteredOptions.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-4">
          <p className="text-muted-foreground">No ride options found matching your criteria.</p>
          <Button variant="outline">Change Filters</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div ref={resultsRef} className="space-y-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={filter}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {filteredOptions.map((option, index) => (
            <motion.div
              key={option.id}
              className="result-item"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ scale: 1.01 }}
            >
              <Card className="overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                <CardContent className="p-0">
                  <div className="grid grid-cols-1 md:grid-cols-4">
                    <div className="bg-primary/5 p-4 flex items-center justify-center md:border-r border-border">
                      <div className="flex flex-col items-center text-center">
                        {getServiceIcon(option.service)}
                        <div className="text-sm font-medium mt-2">
                          {option.service}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {option.type}
                        </div>
                      </div>
                    </div>

                    <div className="col-span-2 p-4 space-y-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 text-muted-foreground mr-1" />
                          <span className="text-sm">{option.estimatedTime} min</span>
                        </div>

                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 text-muted-foreground mr-1" />
                          <span className="text-sm">${option.estimatedPrice.toFixed(2)}</span>
                        </div>

                        {option.ecoFriendly && (
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Zap className="h-3 w-3" />
                            Eco
                          </Badge>
                        )}
                      </div>

                      <div className="space-y-1">
                        <div className="text-sm">
                          {option.distance} km total distance
                        </div>

                        {filter === 'fastest' && index === 0 && (
                          <Badge variant="secondary">Fastest Option</Badge>
                        )}

                        {filter === 'cheapest' && index === 0 && (
                          <Badge variant="secondary">Best Value</Badge>
                        )}
                      </div>
                    </div>

                    <div className="bg-card p-4 flex flex-col justify-center items-center md:items-end space-y-2 border-t md:border-t-0 md:border-l border-border">
                      <div className="text-lg font-semibold">
                        ${option.estimatedPrice.toFixed(2)}
                      </div>

                      <Button size="sm">
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
