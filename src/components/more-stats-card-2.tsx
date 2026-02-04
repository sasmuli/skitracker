"use client";

import Link from "next/link";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import type { SkiDay } from "@/types";

interface MoreStatsCard2Props {
  skiDays: SkiDay[];
}

export function MoreStatsCard2({ skiDays }: MoreStatsCard2Props) {
  // Calculate cumulative distance data
  const sortedDays = [...skiDays].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  let cumulativeDistance = 0;
  const distanceData = sortedDays.map((day, index) => {
    cumulativeDistance += day.distance_km || 0;
    return {
      day: index + 1,
      distance: Math.round(cumulativeDistance * 10) / 10,
      date: new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    };
  });

  // Calculate average rating
  const ratingsArray = skiDays.filter(day => day.rating !== null).map(day => day.rating!);
  const avgRating = ratingsArray.length > 0 
    ? ratingsArray.reduce((sum, rating) => sum + rating, 0) / ratingsArray.length 
    : null;

  // Calculate total hours
  const totalHours = skiDays.reduce((sum, day) => sum + (day.hours || 0), 0);
  const workdays = Math.round((totalHours / 8) * 10) / 10;

  // Render stars for rating
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<span key={i} className="text-yellow-400 text-xl">★</span>);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<span key={i} className="text-yellow-400 text-xl">★</span>);
      } else {
        stars.push(<span key={i} className="text-gray-600 text-xl">★</span>);
      }
    }
    return stars;
  };

  const hasData = distanceData.length > 0 && distanceData[distanceData.length - 1].distance > 0;

  return (
    <div className="glass-card">
      <div className="glass-card-header">
        <h3 className="glass-card-title">Performance Stats</h3>
      </div>
      <div className="glass-card-content">
        {hasData ? (
          <>
            <p className="text-xs text-[var(--color-text-muted)] mb-2 text-center">
              Cumulative Distance
            </p>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart 
                data={distanceData}
                margin={{ top: 10, right: 20, left: 0, bottom: 15 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis 
                  dataKey="day" 
                  stroke="#94a3b8"
                  style={{ fontSize: '11px' }}
                  label={{ value: 'Ski Day', position: 'insideBottom', offset: -5, fill: '#94a3b8', fontSize: 11 }}
                />
                <YAxis 
                  stroke="#94a3b8"
                  style={{ fontSize: '11px' }}
                  label={{ value: 'Distance (km)', angle: -90, position: 'insideLeft', offset: 5, fill: '#94a3b8', fontSize: 11 }}
                />
                <Tooltip
                  contentStyle={{
                    background: "linear-gradient(to bottom right, rgba(39, 39, 39, 0.75) 20%, rgba(0, 0, 0, 0.6) 65%)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    border: "1px solid rgba(255, 255, 255, 0.07)",
                    borderRadius: "8px",
                    color: "#f1f5f9",
                    fontSize: "12px",
                    boxShadow: "0 6px 16px rgba(0, 0, 0, 0.25)",
                  }}
                  labelStyle={{ color: "#94a3b8" }}
                  labelFormatter={(value) => {
                    const dataPoint = distanceData.find(d => d.day === value);
                    return dataPoint ? `${value} - ${dataPoint.date}` : value;
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="distance" 
                  stroke="#38bdf8" 
                  strokeWidth={2}
                  dot={{ fill: '#38bdf8', r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </>
        ) : (
          <p className="text-sm text-[var(--color-text-muted)] text-center py-8">
            No distance data yet. Start tracking!
          </p>
        )}

        {/* Stats Section */}
        <div className="mt-6 pt-4 border-t border-[rgba(255,255,255,0.07)]">
          {/* Average Rating */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <p className="text-xs text-[var(--color-text-muted)]">Average Rating</p>
              <p className="text-sm font-semibold text-yellow-400">
                {avgRating !== null ? `${avgRating.toFixed(1)} / 5` : 'N/A'}
              </p>
            </div>
            {avgRating !== null ? (
              <div className="relative h-2 bg-[rgba(255,255,255,0.05)] rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full transition-all duration-500"
                  style={{ width: `${(avgRating / 5) * 100}%` }}
                />
              </div>
            ) : (
              <p className="text-sm text-[var(--color-text-muted)] text-center">No ratings yet</p>
            )}
          </div>

          {/* Total Hours */}
          <div className="text-center mb-4">
            <p className="text-xs text-[var(--color-text-muted)] mb-1">Total Hours</p>
            <p className="text-lg font-semibold text-[var(--foreground)]">
              {totalHours} hrs{" "}
              <span className="text-sm text-sky-400">({workdays} workdays)</span>
            </p>
          </div>
        </div>

        <div className="mt-4 text-center">
          <Link href="/stats" className="btn btn-primary text-sm">
            See more stats
          </Link>
        </div>
      </div>
    </div>
  );
}