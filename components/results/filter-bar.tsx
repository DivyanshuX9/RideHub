'use client';

import { Button } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from '@/components/ui/tooltip';
import { motion } from 'framer-motion';
import { Bus, Clock, DollarSign, List, Map, Zap } from 'lucide-react';

interface FilterBarProps {
  activeFilter: 'fastest' | 'cheapest' | 'eco' | 'public';
  setActiveFilter: (filter: 'fastest' | 'cheapest' | 'eco' | 'public') => void;
  showMap: boolean;
  setShowMap: (show: boolean) => void;
  showPublicOption: boolean;
}

export function FilterBar({
  activeFilter,
  setActiveFilter,
  showMap,
  setShowMap,
  showPublicOption
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
        {showPublicOption && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={activeFilter === 'public' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveFilter('public')}
                  className="flex-1 sm:flex-none"
                >
                  <Bus className="h-4 w-4 mr-2" />
                  Public
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Show only public transport options</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
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