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
import { getRideRecommendations } from '@/lib/mock-data';
import { RideRecommendation } from '@/types/location';
import { NominatimResult, reverseGeocode, useNominatim } from '@/hooks/use-nominatim';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Bike, Bus, Calendar, CarFront, Clock, Loader2, LocateFixed, MapPin, Train, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

interface LatLon { lat: string; lon: string; }

// Reusable suggestion dropdown
function LocationSuggestions({
  show, loading, results, onSelect,
}: {
  show: boolean;
  loading: boolean;
  results: NominatimResult[];
  onSelect: (result: NominatimResult) => void;
}) {
  if (!show) return null;
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        className="absolute z-50 left-0 right-0 mt-1 bg-popover shadow-lg rounded-md border overflow-hidden"
      >
        {loading ? (
          <div className="flex items-center gap-2 px-3 py-3 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Searching...
          </div>
        ) : results.length === 0 ? (
          <div className="px-3 py-3 text-sm text-muted-foreground">No results found</div>
        ) : (
          <div className="p-1 max-h-56 overflow-y-auto">
            {results.map((r) => (
              <div
                key={r.place_id}
                className="px-3 py-2 text-sm rounded-md hover:bg-accent cursor-pointer flex items-start gap-2"
                onMouseDown={(e) => { e.preventDefault(); onSelect(r); }}
              >
                <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0 text-muted-foreground" />
                <span className="line-clamp-2">{r.display_name}</span>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

export function SearchBar({
  fromValue,
  toValue,
  rideType: rideTypeProp,
  setRideType: setRideTypeProp,
  date: dateProp,
  setDate: setDateProp,
  time: timeProp,
  setTime: setTimeProp,
  onSearch,
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
  const [fromCoords, setFromCoords] = useState<LatLon | null>(null);
  const [toCoords, setToCoords] = useState<LatLon | null>(null);
  const [date, setDate] = useState<Date | undefined>(dateProp || new Date());
  const [rideType, setRideType] = useState(rideTypeProp || 'now');
  const [recommendations, setRecommendations] = useState<RideRecommendation[]>([]);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [time, setTime] = useState<string>(timeProp || '');
  const [fromFocused, setFromFocused] = useState(false);
  const [toFocused, setToFocused] = useState(false);
  const [locatingFrom, setLocatingFrom] = useState(false);
  const [browserCoords, setBrowserCoords] = useState<{ lat: number; lon: number } | undefined>(undefined);

  // Silently grab browser coords once for proximity bias
  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => setBrowserCoords({ lat: coords.latitude, lon: coords.longitude }),
      () => {}
    );
  }, []);

  const userCoords = fromCoords
    ? { lat: parseFloat(fromCoords.lat), lon: parseFloat(fromCoords.lon) }
    : browserCoords;
  const { results: fromResults, loading: fromLoading } = useNominatim(from, fromFocused, userCoords);
  const { results: toResults, loading: toLoading } = useNominatim(to, toFocused, userCoords);

  useEffect(() => { if (fromValue !== undefined) setFrom(fromValue); }, [fromValue]);
  useEffect(() => { if (toValue !== undefined) setTo(toValue); }, [toValue]);

  const rideTypeVal = rideTypeProp !== undefined ? rideTypeProp : rideType;
  const dateVal = dateProp !== undefined ? dateProp : date;
  const timeVal = timeProp !== undefined ? timeProp : time;
  const setRideTypeVal = setRideTypeProp || setRideType;
  const setDateVal = setDateProp || setDate;
  const setTimeVal = setTimeProp || setTime;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!from || !to) return;
    setHasSubmitted(true);
    setRecommendations(getRideRecommendations(from, to));
    setShowRecommendations(true);
    if (onSearch) onSearch(from, to);

    const params = new URLSearchParams({
      from,
      to,
      ...(fromCoords ? { fromLat: fromCoords.lat, fromLon: fromCoords.lon } : {}),
      ...(toCoords   ? { toLat:   toCoords.lat,   toLon:   toCoords.lon   } : {}),
    });
    router.push(`/results?${params.toString()}`);
  };

  const pickFrom = (r: NominatimResult) => {
    setFrom(r.display_name);
    setFromCoords({ lat: r.lat, lon: r.lon });
    setFromFocused(false);
  };

  const pickTo = (r: NominatimResult) => {
    setTo(r.display_name);
    setToCoords({ lat: r.lat, lon: r.lon });
    setToFocused(false);
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) return;
    setLocatingFrom(true);
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const name = await reverseGeocode(coords.latitude, coords.longitude);
        setFrom(name);
        setFromCoords({ lat: String(coords.latitude), lon: String(coords.longitude) });
        setLocatingFrom(false);
      },
      () => setLocatingFrom(false)
    );
  };

  const getIconByName = (iconName: string): JSX.Element => {
    switch (iconName) {
      case 'uber':   return <UberLogo className="h-10 w-10" />;
      case 'ola':    return <OlaLogo className="h-14 w-14" />;
      case 'rapido': return <RapidoLogo className="h-9 w-9" />;
      case 'train':  return <Train className="h-10 w-10" />;
      case 'bus':    return <Bus className="h-10 w-10" />;
      case 'bike':   return <Bike className="h-8 w-8" />;
      case 'zap':    return <Zap className="h-8 w-8" />;
      default:       return <CarFront className="h-8 w-8" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="shadow-lg border-0 bg-card">
        <CardContent className="p-6">
          <form onSubmit={handleSearch}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

              {/* FROM */}
              <div className="relative">
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="From where?"
                    className="pl-10 pr-10"
                    value={from}
                    onChange={(e) => { setFrom(e.target.value); setFromCoords(null); }}
                    onFocus={() => setFromFocused(true)}
                    onBlur={() => setTimeout(() => setFromFocused(false), 150)}
                  />
                  <Button
                    type="button" variant="ghost" size="icon"
                    className="absolute right-1 top-1"
                    onClick={useCurrentLocation}
                    disabled={locatingFrom}
                  >
                    {locatingFrom ? <Loader2 className="h-4 w-4 animate-spin" /> : <LocateFixed className="h-4 w-4" />}
                  </Button>
                </div>
                {fromFocused && (
                  <AnimatePresence>
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      className="absolute z-50 left-0 right-0 mt-1 bg-popover shadow-lg rounded-md border overflow-hidden"
                    >
                      <div className="p-1 max-h-56 overflow-y-auto">
                        <div
                          className="px-3 py-2 text-sm rounded-md hover:bg-accent cursor-pointer flex items-center gap-2 border-b border-border mb-1"
                          onMouseDown={(e) => { e.preventDefault(); useCurrentLocation(); setFromFocused(false); }}
                        >
                          {locatingFrom ? <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" /> : <LocateFixed className="h-3.5 w-3.5 text-primary" />}
                          <span className="font-medium text-primary">My location</span>
                        </div>
                        {from.length >= 3 && (
                          fromLoading ? (
                            <div className="flex items-center gap-2 px-3 py-3 text-sm text-muted-foreground">
                              <Loader2 className="h-4 w-4 animate-spin" /> Searching...
                            </div>
                          ) : fromResults.length === 0 ? (
                            <div className="px-3 py-3 text-sm text-muted-foreground">No results found</div>
                          ) : (
                            fromResults.map((r) => (
                              <div
                                key={r.place_id}
                                className="px-3 py-2 text-sm rounded-md hover:bg-accent cursor-pointer flex items-start gap-2"
                                onMouseDown={(e) => { e.preventDefault(); pickFrom(r); }}
                              >
                                <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0 text-muted-foreground" />
                                <span className="line-clamp-2">{r.display_name}</span>
                              </div>
                            ))
                          )
                        )}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                )}
              </div>

              {/* TO */}
              <div className="relative">
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="Where to?"
                    className="pl-10"
                    value={to}
                    onChange={(e) => { setTo(e.target.value); setToCoords(null); }}
                    onFocus={() => setToFocused(true)}
                    onBlur={() => setTimeout(() => setToFocused(false), 150)}
                  />
                </div>
                <LocationSuggestions
                  show={toFocused && to.length >= 3}
                  loading={toLoading}
                  results={toResults}
                  onSelect={pickTo}
                />
              </div>

              {/* DATE / SEARCH */}
              <div className="flex space-x-2">
                <div className="flex-1">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        {rideTypeVal === 'now'
                          ? <><Clock className="mr-2 h-4 w-4" /><span>Now</span></>
                          : <><Calendar className="mr-2 h-4 w-4" /><span>{dateVal ? dateVal.toLocaleDateString() : 'Select date'}</span></>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-4" align="end">
                      <div className="space-y-4">
                        <RadioGroup defaultValue={rideTypeVal} onValueChange={setRideTypeVal}>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="now" id="now" />
                            <Label htmlFor="now">Leave now</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="schedule" id="schedule" />
                            <Label htmlFor="schedule">Schedule for later</Label>
                          </div>
                        </RadioGroup>
                        {rideTypeVal === 'schedule' && (
                          <>
                            <CalendarComponent
                              mode="single"
                              selected={dateVal}
                              onSelect={(d) => d && setDateVal(d)}
                              disabled={(d) => d < new Date()}
                            />
                            <div className="mt-2">
                              <Label htmlFor="schedule-time">Select time</Label>
                              <input
                                id="schedule-time" type="time"
                                className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none"
                                value={timeVal}
                                onChange={(e) => setTimeVal(e.target.value)}
                              />
                            </div>
                            {dateVal && timeVal && (
                              <div className="mt-2 text-sm font-medium text-primary">
                                {`${dateVal.getDate().toString().padStart(2, '0')}/${(dateVal.getMonth() + 1).toString().padStart(2, '0')}/${dateVal.getFullYear()} | ${(() => {
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

                <Button type="submit" disabled={!from || !to} className="shrink-0 px-4">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
            </div>
          </form>

          <AnimatePresence>
            {hasSubmitted && showRecommendations && recommendations.length > 0 && (
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
                                <div className="font-medium capitalize">{rec.service} {rec.type}</div>
                                <div className="text-xs text-muted-foreground">{rec.estimatedTime} min • {rec.distance} km</div>
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
