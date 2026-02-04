"use client";

import Link from "next/link";
import { PieChart, Pie, ResponsiveContainer, Legend, Tooltip } from "recharts";
import type { SkiDay } from "@/types";
import { SKI_TYPES } from "@/types/constants";

interface MoreStatsCard1Props {
  skiDays: SkiDay[];
}

export function MoreStatsCard1({ skiDays }: MoreStatsCard1Props) {
  const typeCount: Record<string, number> = {};
  
  skiDays.forEach((day) => {
    if (day.ski_types && Array.isArray(day.ski_types)) {
      day.ski_types.forEach((type) => {
        typeCount[type] = (typeCount[type] || 0) + 1;
      });
    }
  });

  const chartData = SKI_TYPES.map((type) => ({
    name: type.label,
    value: typeCount[type.id] || 0,
    fill: type.color,
  })).filter((item) => item.value > 0);

  const hasData = chartData.length > 0;

  // Calculate most visited resort
  const resortCount: Record<string, { name: string; count: number }> = {};
  skiDays.forEach((day) => {
    if (day.resort) {
      const resortId = day.resort.id;
      if (!resortCount[resortId]) {
        resortCount[resortId] = { name: day.resort.name, count: 0 };
      }
      resortCount[resortId].count++;
    }
  });
  
  const mostVisited = Object.values(resortCount).sort((a, b) => b.count - a.count)[0];

  // Calculate days in last 365 days
  const today = new Date();
  const oneYearAgo = new Date(today);
  oneYearAgo.setDate(today.getDate() - 365);
  
  const daysInLast365 = skiDays.filter((day) => {
    const dayDate = new Date(day.date);
    return dayDate >= oneYearAgo && dayDate <= today;
  }).length;

  const progressPercentage = Math.min((daysInLast365 / 365) * 100, 100);

  return (
    <div className="glass-card">
      <div className="glass-card-header">
        <h3 className="glass-card-title">Ski Type Distribution</h3>
      </div>
      <div className="glass-card-content">
        {hasData ? (
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry: any) => {
                  const percent = entry.percent || 0;
                  return `${entry.name} ${(percent * 100).toFixed(0)}%`;
                }}
                outerRadius={80}
                dataKey="value"
              />
              <Tooltip
                contentStyle={{
                  background: "linear-gradient(to bottom right, rgba(39, 39, 39, 0.75) 20%, rgba(0, 0, 0, 0.6) 65%)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  border: "1px solid rgba(255, 255, 255, 0.07)",
                  borderRadius: "8px",
                  color: "#f1f5f9",
                  fontSize: "13px",
                  boxShadow: "0 6px 16px rgba(0, 0, 0, 0.25)",
                }}
                itemStyle={{
                  color: "#f1f5f9",
                }}
              />
              <Legend
                wrapperStyle={{
                  fontSize: "13px",
                  color: "#94a3b8",
                }}
                iconType="square"
                iconSize={10}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-sm text-[var(--color-text-muted)] text-center py-8">
            No ski type data yet. Start tracking your days!
          </p>
        )}

        {/* Most Visited Resort */}
        <div className="mt-6 pt-4 border-t border-[rgba(255,255,255,0.07)]">
          <div className="text-center mb-4">
            <p className="text-xs text-[var(--color-text-muted)] mb-1">Most Visited Resort</p>
            {mostVisited ? (
              <p className="text-lg font-semibold text-[var(--foreground)]">
                {mostVisited.name}{" "}
                <span className="text-sm text-sky-400">({mostVisited.count} visits)</span>
              </p>
            ) : (
              <p className="text-sm text-[var(--color-text-muted)]">No resort data yet</p>
            )}
          </div>

          {/* Days in Last 365 */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <p className="text-xs text-[var(--color-text-muted)]">Days in Last 365</p>
              <p className="text-sm font-semibold text-sky-400">
                {daysInLast365} / 365
              </p>
            </div>
            <div className="relative h-2 bg-[rgba(255,255,255,0.05)] rounded-full overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-sky-400 to-sky-500 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <p className="text-xs text-[var(--color-text-muted)] mt-1 text-right">
              {progressPercentage.toFixed(1)}% of the year
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