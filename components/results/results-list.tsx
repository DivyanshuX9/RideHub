'use client';

import { OlaLogo } from '@/components/logos/OlaLogo';
import { RapidoLogo } from '@/components/logos/RapidoLogo';
import { UberLogo } from '@/components/logos/UberLogo';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { filterRideOptions } from '@/lib/mock-data';
import { AnimatePresence, motion } from 'framer-motion';
import { Bus, Car, Clock, DollarSign, Train, Zap } from 'lucide-react';
import { useState } from 'react';

interface ResultsListProps {
  filter: 'fastest' | 'cheapest' | 'eco' | 'public';
  categorized?: boolean;
}

export function ResultsList({ filter, categorized = false }: ResultsListProps) {
  let filteredOptions = filterRideOptions(filter as any);
  if (filter === 'public') {
    filteredOptions = filterRideOptions('fastest').filter(r => ['bus', 'metro'].includes(r.service.toLowerCase()));
  }

  // Categorize rides
  const categories = [
    { key: 'fastest', label: 'Fastest' },
    { key: 'cheapest', label: 'Cheapest' },
    { key: 'eco', label: 'Eco' },
    { key: 'public', label: 'Public' },
  ];
  const [activeCategory, setActiveCategory] = useState(filter);

  // Group rides by category
  const ridesByCategory = {
    fastest: filterRideOptions('fastest').filter(r => !['bus', 'metro'].includes(r.service.toLowerCase())),
    cheapest: filterRideOptions('cheapest').filter(r => !['bus', 'metro'].includes(r.service.toLowerCase())),
    eco: filterRideOptions('eco').filter(r => !['bus', 'metro'].includes(r.service.toLowerCase())),
    public: filterRideOptions('fastest').filter(r => ['bus', 'metro'].includes(r.service.toLowerCase())),
  };

  const getServiceIcon = (service: string) => {
    switch (service.toLowerCase()) {
      case 'uber':
        return <UberLogo className="h-12 w-12" />;
      case 'ola':
        return <OlaLogo className="h-10 w-10" />;
      case 'rapido':
        return <RapidoLogo className="h-12 w-12" />;
      case 'metro':
        return <Train className="h-5 w-5" />;
      case 'bus':
        return <Bus className="h-5 w-5" />;
      default:
        return <Car className="h-5 w-5" />;
    }
  };

  if (categorized) {
    return (
      <div>
        <div className="flex gap-2 mb-4">
          {categories.map(cat => (
            <button
              key={cat.key}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeCategory === cat.key ? 'bg-primary text-white' : 'bg-muted text-muted-foreground hover:bg-accent'}`}
              onClick={() => setActiveCategory(cat.key as any)}
            >
              {cat.label}
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {ridesByCategory[activeCategory].length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-4">
                  <p className="text-muted-foreground">No ride options found in this category.</p>
                </CardContent>
              </Card>
            ) : (
              ridesByCategory[activeCategory].map((option, index) => (
                <motion.div
                  key={option.id}
                  className="result-item"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ scale: 1.01 }}
                >
                  <Card className={`overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 ${activeCategory === 'public' ? 'border-l-4 border-blue-500' : ''}`}>
                    <CardContent className="p-0">
                      <div className="grid grid-cols-1 md:grid-cols-4">
                        <div className="bg-primary/5 p-4 flex items-center justify-center md:border-r border-border">
                          <div className="flex flex-col items-center text-center">
                            {option.service.toLowerCase() === 'bus' || option.service.toLowerCase() === 'metro' ? (
                              <Bus className="h-10 w-10 text-blue-500" />
                            ) : (
                              getServiceIcon(option.service)
                            )}
                            <div className="text-xs text-muted-foreground mt-1">{option.type}</div>
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
                                <Zap className="h-3 w-3" /> Eco
                              </Badge>
                            )}
                          </div>
                          <div className="space-y-1">
                            <div className="text-sm">{option.distance} km total distance</div>
                            {activeCategory === 'fastest' && index === 0 && (
                              <Badge variant="secondary">Fastest Option</Badge>
                            )}
                            {activeCategory === 'cheapest' && index === 0 && (
                              <Badge variant="secondary">Best Value</Badge>
                            )}
                          </div>
                        </div>
                        <div className="bg-card p-4 flex flex-col justify-center items-center md:items-end space-y-2 border-t md:border-t-0 md:border-l border-border">
                          <div className="text-lg font-semibold">${option.estimatedPrice.toFixed(2)}</div>
                          <Button size="sm">Book Now</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

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
    <div className="space-y-4">
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
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.01 }}
            >
              <Card className="overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                <CardContent className="p-0">
                  <div className="grid grid-cols-1 md:grid-cols-4">
                    <div className="bg-primary/5 p-4 flex items-center justify-center md:border-r border-border">
                      <div className="flex flex-col items-center text-center">
                        {getServiceIcon(option.service)}
                        {/* <div className="text-sm font-medium mt-2">
                          {option.service}
                        </div> */}
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
