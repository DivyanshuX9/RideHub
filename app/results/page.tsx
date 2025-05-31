'use client';

import { SearchBar } from '@/components/home/search-bar';
import { FilterBar } from '@/components/results/filter-bar';
import { MapView } from '@/components/results/map-view';
import { ResultsList } from '@/components/results/results-list';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

export default function ResultsPage() {
  return (
    <Suspense fallback={<ResultsPageLoader />}> 
      <ResultsPageContent />
    </Suspense>
  );
}

function ResultsPageLoader() {
  // 400ms debounce before showing loader
  const [show, setShow] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShow(true), 400);
    return () => clearTimeout(t);
  }, []);
  if (!show) return null;
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl px-4">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-40 w-full mb-4" />
        ))}
      </div>
    </div>
  );
}

function ResultsPageContent() {
  const searchParams = useSearchParams();
  const from = searchParams.get('from') || '';
  const to = searchParams.get('to') || '';
  const [activeFilter, setActiveFilter] = useState<'fastest' | 'cheapest' | 'eco' | 'public'>('fastest');
  const [showMap, setShowMap] = useState(true);
  const [rideType, setRideType] = useState('now');
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState('');

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-2xl font-bold">Ride Options</h1>
        </motion.div>
        <div className="mb-2">
          <SearchBar
            fromValue={from}
            toValue={to}
            rideType={rideType}
            setRideType={setRideType}
            date={date}
            setDate={setDate}
            time={time}
            setTime={setTime}
          />
        </div>
        {date && time && (
          <div className="mb-6 text-sm font-medium text-primary">
            {`${date.getDate().toString().padStart(2, '0')}/${(date.getMonth()+1).toString().padStart(2, '0')}/${date.getFullYear()} | ${(() => {
              const [h, m] = time.split(':');
              let hour = parseInt(h, 10);
              const ampm = hour >= 12 ? 'pm' : 'am';
              hour = hour % 12 || 12;
              return `${hour.toString().padStart(2, '0')}:${m} ${ampm}`;
            })()}`}
          </div>
        )}
        <FilterBar 
          activeFilter={activeFilter} 
          setActiveFilter={setActiveFilter}
          showMap={showMap}
          setShowMap={setShowMap}
          showPublicOption={true}
        />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <motion.div 
            layout
            className={showMap ? "col-span-1 lg:col-span-2" : "col-span-1 lg:col-span-3"}
          >
            <ResultsList filter={activeFilter} />
          </motion.div>
          {showMap && (
            <motion.div 
              layout
              className="col-span-1 h-[500px] lg:h-auto rounded-xl overflow-hidden sticky top-24"
            >
              <MapView from={from} to={to} />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}