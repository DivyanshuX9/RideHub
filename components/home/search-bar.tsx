'use client';

import { OlaLogo } from '@/components/logos/OlaLogo';
import { RapidoLogo } from '@/components/logos/RapidoLogo';
import { UberLogo } from '@/components/logos/UberLogo';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { getRideRecommendations, popularLocations } from '@/lib/mock-data';
import { RideRecommendation } from '@/types/location';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Bike, Bus, Calendar, CarFront, Clock, LocateFixed, MapPin, Train, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export function SearchBar({
  fromValue,
  toValue,
  rideType: rideTypeProp,
  setRideType: setRideTypeProp,
  date: dateProp,
  setDate: setDateProp,
  time: timeProp,
  setTime: setTimeProp,
  onSearch
}: {
  fromValue?: string;
  toValue?: string;
  rideType?: string;
  setRideType?: (v: string) => void;
  date?: Date;
  setDate?: (d: Date) => void;
  time?: string;
  setTime?: (t: string) => void;
  onSearch?: (from: string, to: string) => void;
} = {}) {
  const router = useRouter();
  const [from, setFrom] = useState(fromValue || '');
  const [to, setTo] = useState(toValue || '');
  const [date, setDate] = useState<Date | undefined>(dateProp || new Date());
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [showToSuggestions, setShowToSuggestions] = useState(false);
  const [rideType, setRideType] = useState(rideTypeProp || 'now');
  const [recommendations, setRecommendations] = useState<RideRecommendation[]>([]);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [time, setTime] = useState<string>(timeProp || '');
  
  // Sync local state with props if they change
  useEffect(() => {
    if (fromValue !== undefined) setFrom(fromValue);
  }, [fromValue]);
  useEffect(() => {
    if (toValue !== undefined) setTo(toValue);
  }, [toValue]);
  
  // Use controlled values if provided
  const fromVal = from;
  const toVal = to;
  const rideTypeVal = rideTypeProp !== undefined ? rideTypeProp : rideType;
  const dateVal = dateProp !== undefined ? dateProp : date;
  const timeVal = timeProp !== undefined ? timeProp : time;
  const setRideTypeVal = setRideTypeProp || setRideType;
  const setDateVal = setDateProp || setDate;
  const setTimeVal = setTimeProp || setTime;
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (fromVal && toVal) {
      if (onSearch) onSearch(fromVal, toVal);
      router.push(`/results?from=${encodeURIComponent(fromVal)}&to=${encodeURIComponent(toVal)}`);
    }
  };
  
  const handleLocationChange = (value: string, field: 'from' | 'to') => {
    let newFrom = fromVal;
    let newTo = toVal;
    if (field === 'from') {
      newFrom = value;
      setFrom(value);
    } else {
      newTo = value;
      setTo(value);
    }
    // Update recommendations when both locations are set
    if (newFrom && newTo) {
      const newRecommendations = getRideRecommendations(newFrom, newTo);
      setRecommendations(newRecommendations);
      setShowRecommendations(true);
    }
  };
  
  const handleSuggestionClick = (location: string, field: 'from' | 'to') => {
    handleLocationChange(location, field);
    if (field === 'from') {
      setFrom(location);
      setShowFromSuggestions(false);
    } else {
      setTo(location);
      setShowToSuggestions(false);
    }
  };
  
  const useCurrentLocation = () => {
    // Simulate getting current location
    setTimeout(() => {
      handleLocationChange('Current Location', 'from');
      setShowFromSuggestions(false);
    }, 500);
  };

  const getIconByName = (iconName: string): JSX.Element => {
    switch (iconName) {
      case 'uber':
        return React.createElement(UberLogo, { className: 'h-10 w-10' });
      case 'ola':
        return React.createElement(OlaLogo, { className: 'h-14 w-14' });
      case 'rapido':
        return React.createElement(RapidoLogo, { className: 'h-9 w-9' });
      case 'train':
        return React.createElement(Train, { className: 'h-10 w-10' });
      case 'bus':
        return React.createElement(Bus, { className: 'h-10 w-10' });
      case 'car-front':
        return React.createElement(CarFront, { className: 'h-8 w-8' });
      case 'bike':
        return React.createElement(Bike, { className: 'h-8 w-8' });
      case 'zap':
        return React.createElement(Zap, { className: 'h-8 w-8' });
      default:
        return React.createElement(CarFront, { className: 'h-8 w-8' });
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="shadow-lg border-0 bg-card/90 backdrop-blur-sm">
        <CardContent className="p-6">
          <form onSubmit={handleSearch}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input 
                    placeholder="From where?"
                    className="pl-10 pr-10"
                    value={fromVal}
                    onChange={(e) => {
                      setFrom(e.target.value);
                      handleLocationChange(e.target.value, 'from');
                      setShowFromSuggestions(true);
                    }}
                    onFocus={() => setShowFromSuggestions(true)}
                    onKeyDown={e => {
                      if (showFromSuggestions && e.key === 'Enter') {
                        e.preventDefault();
                        setShowFromSuggestions(false);
                      }
                    }}
                  />
                  <Button 
                    type="button"
                    variant="ghost" 
                    size="icon"
                    className="absolute right-1 top-1"
                    onClick={useCurrentLocation}
                    title="Use current location"
                  >
                    <LocateFixed className="h-4 w-4" />
                  </Button>
                </div>
                
                <AnimatePresence>
                  {showFromSuggestions && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute z-10 left-0 right-0 mt-1 bg-popover shadow-lg rounded-md border overflow-hidden"
                    >
                      <div className="p-1">
                        {popularLocations.map((location) => (
                          <div
                            key={location.id}
                            className="px-3 py-2 text-sm rounded-md hover:bg-accent cursor-pointer"
                            onClick={() => handleSuggestionClick(location.name, 'from')}
                          >
                            {location.name}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              <div className="relative">
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input 
                    placeholder="Where to?"
                    className="pl-10"
                    value={toVal}
                    onChange={(e) => {
                      setTo(e.target.value);
                      handleLocationChange(e.target.value, 'to');
                      setShowToSuggestions(true);
                    }}
                    onFocus={() => setShowToSuggestions(true)}
                    onKeyDown={e => {
                      if (showToSuggestions && e.key === 'Enter') {
                        e.preventDefault();
                        setShowToSuggestions(false);
                      }
                    }}
                  />
                </div>
                
                <AnimatePresence>
                  {showToSuggestions && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute z-10 left-0 right-0 mt-1 bg-popover shadow-lg rounded-md border overflow-hidden"
                    >
                      <div className="p-1">
                        {popularLocations.map((location) => (
                          <div
                            key={location.id}
                            className="px-3 py-2 text-sm rounded-md hover:bg-accent cursor-pointer"
                            onClick={() => handleSuggestionClick(location.name, 'to')}
                          >
                            {location.name}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              <div className="flex space-x-2">
                <div className="flex-1">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start text-left font-normal"
                      >
                        <div className="flex items-center">
                          {rideTypeVal === 'now' ? (
                            <>
                              <Clock className="mr-2 h-4 w-4" />
                              <span>Now</span>
                            </>
                          ) : (
                            <>
                              <Calendar className="mr-2 h-4 w-4" />
                              <span>
                                {dateVal ? dateVal.toLocaleDateString() : 'Select date'}
                              </span>
                            </>
                          )}
                        </div>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-4" align="end">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <RadioGroup 
                            defaultValue={rideTypeVal}
                            onValueChange={setRideTypeVal}
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="now" id="now" />
                              <Label htmlFor="now">Leave now</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="schedule" id="schedule" />
                              <Label htmlFor="schedule">Schedule for later</Label>
                            </div>
                          </RadioGroup>
                        </div>
                        
                        {rideTypeVal === 'schedule' && (
                          <>
                            <CalendarComponent
                              mode="single"
                              selected={dateVal}
                              onSelect={d => d && setDateVal(d)}
                              disabled={(date) => date < new Date()}
                            />
                            <div className="mt-2">
                              <Label htmlFor="schedule-time">Select time</Label>
                              <input
                                id="schedule-time"
                                type="time"
                                className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none"
                                value={timeVal}
                                onChange={e => setTimeVal(e.target.value)}
                                placeholder="Select time"
                              />
                            </div>
                            {dateVal && timeVal && (
                              <div className="mt-2 text-sm font-medium text-primary">
                                {`${dateVal.getDate().toString().padStart(2, '0')}/${(dateVal.getMonth()+1).toString().padStart(2, '0')}/${dateVal.getFullYear()} | ${(() => {
                                  const [h, m] = timeVal.split(':');
                                  let hour = parseInt(h, 10);
                                  const ampm = hour >= 12 ? 'pm' : 'am';
                                  hour = hour % 12 || 12;
                                  return `${hour.toString().padStart(2, '0')}:${m} ${ampm}`;
                                })()}`}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
                
                <Button 
                  type="submit" 
                  size="icon"
                  disabled={!fromVal || !toVal}
                  className="shrink-0"
                >
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </form>

          <AnimatePresence>
            {showRecommendations && recommendations.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 pt-4 border-t"
              >
                <div className="text-sm font-medium mb-2">Available Rides:</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {recommendations.map((rec, index) => (
                    <motion.div
                      key={`${rec.service}-${rec.type}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="hover:bg-accent/50 cursor-pointer transition-colors">
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              {getIconByName(rec.service)}
                              <div>
                                <div className="font-medium capitalize">
                                  {rec.service} {rec.type}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {rec.estimatedTime} min • {rec.distance} km
                                </div>
                              </div>
                            </div>
                            <div className="font-medium">${rec.estimatedPrice.toFixed(2)}</div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}