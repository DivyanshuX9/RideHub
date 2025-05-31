'use client';

import { RecentRides } from '@/components/home/recent-rides';
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
  const [hasSearched, setHasSearched] = useState(!!(from && to));
  const [isLoading, setIsLoading] = useState(false);

  // Handler to set hasSearched when the form is submitted
  const handleSearch = (searchFrom: string, searchTo: string) => {
    if (searchFrom && searchTo) {
      setHasSearched(true);
      setIsLoading(true);
      setTimeout(() => setIsLoading(false), 1200); // Simulate backend fetch
    }
  };

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
            onSearch={handleSearch}
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
        {hasSearched ? (
          isLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="mb-4"
              >
                <svg className="animate-spin h-10 w-10 text-primary" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-lg font-semibold text-primary"
              >
                Fetching rides...
              </motion.div>
            </div>
          ) : (
            <>
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
            </>
          )
        ) : (
          <>
            <h2 className="text-xl font-semibold mb-4">History</h2>
            <RecentRides />
          </>
        )}
      </div>
    </div>
  );
}