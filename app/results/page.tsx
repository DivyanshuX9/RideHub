'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapView } from '@/components/results/map-view';
import { ResultsList } from '@/components/results/results-list';
import { FilterBar } from '@/components/results/filter-bar';
import { useSearchParams } from 'next/navigation';

export default function ResultsPage() {
  const searchParams = useSearchParams();
  const from = searchParams.get('from') || '';
  const to = searchParams.get('to') || '';
  
  const [activeFilter, setActiveFilter] = useState<'fastest' | 'cheapest' | 'eco'>('fastest');
  const [showMap, setShowMap] = useState(true);
  
  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-2xl font-bold">Ride Options</h1>
          <p className="text-muted-foreground">
            From {from} to {to}
          </p>
        </motion.div>
        
        <FilterBar 
          activeFilter={activeFilter} 
          setActiveFilter={setActiveFilter}
          showMap={showMap}
          setShowMap={setShowMap}
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