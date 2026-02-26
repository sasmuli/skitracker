"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser-client";
import { getAggregateStatistics, type AggregateStats } from "@/lib/queries/statistics";
import { Mountain, Globe, Calendar, TrendingUp } from "lucide-react";

export function InfoStatsCards() {
  const [stats, setStats] = useState<AggregateStats>({
    totalResorts: 0,
    totalCountries: 0,
    totalSkiDays: 0,
    mostVisitedResort: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      const supabase = createSupabaseBrowserClient();
      const data = await getAggregateStatistics(supabase);
      setStats(data);
      setLoading(false);
    }
    fetchStats();
  }, []);

  const statCards = [
    {
      icon: Mountain,
      label: "Approved Resorts",
      value: stats.totalResorts,
      color: "text-sky-400",
    },
    {
      icon: Globe,
      label: "Countries Covered",
      value: stats.totalCountries,
      color: "text-sky-400",
    },
    {
      icon: Calendar,
      label: "Total Ski Days",
      value: stats.totalSkiDays,
      color: "text-sky-400",
    },
    {
      icon: TrendingUp,
      label: "Most Visited",
      value: stats.mostVisitedResort?.name || "N/A",
      subValue: stats.mostVisitedResort
        ? `${stats.mostVisitedResort.visits} visits`
        : undefined,
      color: "text-sky-400",
    },
  ];

  return (
    <section className="mb-8">
      <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">
        Quick Statistics
      </h2>
      <div className="grid grid-cols-1 2xs:grid-cols-2 gap-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="glass-card p-4 rounded-lg border border-[rgba(255,255,255,0.1)]"
            >
              <div className="flex items-start justify-between mb-2">
                <Icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div className="text-2xl font-bold text-[var(--foreground)] mb-1">
                {loading ? "..." : stat.value}
              </div>
              <div className="text-xs text-[var(--color-text-muted)]">
                {stat.label}
              </div>
              {stat.subValue && (
                <div className="text-[10px] text-[var(--accent)] mt-1">
                  {stat.subValue}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
