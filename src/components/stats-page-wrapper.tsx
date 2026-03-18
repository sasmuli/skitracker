'use client';

import { useState } from 'react';
import PillNav from '@/components/pill-filter-button';
import { StatsGrid } from '@/components/stats-grid';
import type { SkiDay } from "@/types";

export type FilterCategory = 'all' | 'distance' | 'endurance' | 'resort' | 'quality' | 'types' | 'fun';

interface StatsPageWrapperProps {
  skiDays: SkiDay[];
  totalDistance: number;
  totalHours: number;
  totalDays: number;
  avgRating: number;
  uniqueResorts: number;
  earthPercent: string;
  finlandTimes: string;
  helsinkiRovaniemiTimes: string;
  marathons: number;
  avgSpeed: string;
  avgDayLength: string;
  workdays: number;
  nonStopDays: string;
  avgDistancePerResort: number;
  avgHoursPerResort: string;
  moonPercent: string;
  caloriesBurned: number;
  pullaBuns: number;
  tourPercent: string;
  everestClimbs: number;
  saimaaPercent: string;
  bestDay: number;
  resortDiscoveryRate: string;
  distancePerHour: string;
  adventureRatio: string;
  favoriteResortName: string;
  favoriteResortShare: string;
  ratingConsistency: string;
  skiTypeDistribution: Array<{ type: string; percentage: string }>;
  versatility: string;
}

export function StatsPageWrapper(props: StatsPageWrapperProps) {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('all');

  const handleFilterChange = (value: string) => {
    setActiveFilter(value as FilterCategory);
  };

  return (
    <>
      <h1 className="text-3xl font-bold mb-8">Your Ski Statistics</h1>

      <div className="mb-10 flex justify-center">
        <PillNav
          items={[
            { value: 'all', label: 'All Stats' },
            { value: 'distance', label: 'Distance' },
            { value: 'endurance', label: 'Endurance & Time' },
            { value: 'resort', label: 'Resort' },
            { value: 'quality', label: 'Quality' },
            { value: 'types', label: 'Ski Types' },
            { value: 'fun', label: 'Fun' }
          ]}
          activeValue={activeFilter}
          onFilterChange={handleFilterChange}
          baseColor="rgba(39, 39, 39, 0.8)"
          pillColor="rgba(0, 0, 0, 0.6)"
          pillMobileColor="rgba(0, 0, 0, 0.6)"
          hoveredPillTextColor="var(--accent)"
          pillTextColor="#ffffff"
          initialLoadAnimation={false}
        />
      </div>

      <StatsGrid
        {...props}
        activeFilter={activeFilter}
      />
    </>
  );
}
