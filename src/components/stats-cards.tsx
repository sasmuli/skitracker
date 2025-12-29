'use client';

import { useState, useEffect } from 'react';
import CountUp from './count-up';

type StatsCardsProps = {
  totalDays: number;
  totalHours: number;
  totalDistance: number;
  avgRating: number | null;
  uniqueResorts: number;
};

export function StatsCards({ totalDays, totalHours, totalDistance, avgRating, uniqueResorts }: StatsCardsProps) {
  const avgRatingRounded = avgRating != null ? Math.round(avgRating * 10) / 10 : null;
  
  const [dataKey, setDataKey] = useState(0);
  const [daysKey, setDaysKey] = useState(0);
  const [hoursKey, setHoursKey] = useState(0);
  const [distanceKey, setDistanceKey] = useState(0);
  const [ratingKey, setRatingKey] = useState(0);
  const [resortsKey, setResortsKey] = useState(0);
  
  useEffect(() => {
    setDataKey(prev => prev + 1);
  }, [totalDays, totalHours, avgRating, uniqueResorts]);

  return (
    <div className="stats-cards-grid grid gap-4">
      <div 
        className="glass-card !p-4 text-center cursor-pointer hover:scale-[1.02] transition-transform"
        onClick={() => setDaysKey(prev => prev + 1)}
      >
        <p className="text-2xl font-bold text-sky-400">
          <CountUp key={`days-${dataKey}-${daysKey}`} to={totalDays} duration={1.5} />
        </p>
        <p className="text-xs text-slate-400">Ski Days</p>
      </div>

      <div 
        className="glass-card !p-4 text-center cursor-pointer hover:scale-[1.02] transition-transform"
        onClick={() => setHoursKey(prev => prev + 1)}
      >
        <p className="text-2xl font-bold text-sky-400">
          <CountUp key={`hours-${dataKey}-${hoursKey}`} to={totalHours} duration={1.5} />
        </p>
        <p className="text-xs text-slate-400">Total Hours</p>
      </div>

      <div 
        className="glass-card !p-4 text-center cursor-pointer hover:scale-[1.02] transition-transform"
        onClick={() => setDistanceKey(prev => prev + 1)}
      >
        <p className="text-2xl font-bold text-sky-400">
          <CountUp key={`distance-${dataKey}-${distanceKey}`} to={totalDistance} duration={1.5} />
        </p>
        <p className="text-xs text-slate-400">Total Distance</p>
      </div>

      <div 
        className="glass-card !p-4 text-center cursor-pointer hover:scale-[1.02] transition-transform"
        onClick={() => setRatingKey(prev => prev + 1)}
      >
        <p className="text-2xl font-bold text-sky-400">
          {avgRatingRounded != null ? (
            <CountUp key={`rating-${dataKey}-${ratingKey}`} to={avgRatingRounded} duration={1.5} />
          ) : (
            "-"
          )}
        </p>
        <p className="text-xs text-slate-400">Avg Rating</p>
      </div>
      <div 
        className="glass-card !p-4 text-center cursor-pointer hover:scale-[1.02] transition-transform"
        onClick={() => setResortsKey(prev => prev + 1)}
      >
        <p className="text-2xl font-bold text-sky-400">
          <CountUp key={`resorts-${dataKey}-${resortsKey}`} to={uniqueResorts} duration={1.5} />
        </p>
        <p className="text-xs text-slate-400">Resorts</p>
      </div>
    </div>
  );
}
