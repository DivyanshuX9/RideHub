'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { Zap, Clock, DollarSign, Map, List } from 'lucide-react';

interface FilterBarProps {
  activeFilter: 'fastest' | 'cheapest' | 'eco';
  setActiveFilter: (filter: 'fastest' | 'cheapest' | 'eco') => void;
  showMap: boolean;
  setShowMap: (show: boolean) => void;
}

export function FilterBar({
  activeFilter,
  setActiveFilter,
  showMap,
  setShowMap
}: FilterBarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col sm:flex-row justify-between gap-4 bg-card rounded-lg shadow-sm border p-2"
    >
      <div className="flex gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={activeFilter === 'fastest' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveFilter('fastest')}
                className="flex-1 sm:flex-none"
              >
                <Clock className="h-4 w-4 mr-2" />
                Fastest
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Sort by fastest arrival time</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={activeFilter === 'cheapest' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveFilter('cheapest')}
                className="flex-1 sm:flex-none"
              >
                <DollarSign className="h-4 w-4 mr-2" />
                Cheapest
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Sort by lowest price</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={activeFilter === 'eco' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveFilter('eco')}
                className="flex-1 sm:flex-none"
              >
                <Zap className="h-4 w-4 mr-2" />
                Eco-friendly
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Show only eco-friendly options</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <div className="flex gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={showMap ? 'default' : 'outline'}
                size="sm"
                onClick={() => setShowMap(true)}
                className="flex-1 sm:flex-none"
              >
                <Map className="h-4 w-4 mr-2" />
                Map
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Show map view</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={!showMap ? 'default' : 'outline'}
                size="sm"
                onClick={() => setShowMap(false)}
                className="flex-1 sm:flex-none"
              >
                <List className="h-4 w-4 mr-2" />
                List Only
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Hide map view</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </motion.div>
  );
}