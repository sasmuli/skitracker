import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { SkiCalendarWithDialog } from "@/components/ski-calendar-with-dialog";
import { SkiTypeInfo } from "@/components/ski-type-info";
import { StatsCards } from "@/components/stats-cards";
import { Plus } from "lucide-react";
import {
  getSkiDays,
  getSkiDayStats,
  getCurrentUserWithProfile,
  getResorts,
} from "@/lib/queries";
import { MoreStatsCard1 } from "@/components/more-stats-card-1";
import { MoreStatsCard2 } from "@/components/more-stats-card-2";

//TODO Look if this can be used anywhere https://reactbits.dev/components/magic-bento

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  const { user, profile } = await getCurrentUserWithProfile(supabase);

  const skiDays = await getSkiDays(supabase, user!.id);
  const resorts = await getResorts(supabase);
  const stats = getSkiDayStats(skiDays);

  const displayName = profile?.display_name || "Skier";

  return (
    <div className="space-y-6 pb-10 sm:pb-0">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-semibold">Welcome, {displayName}!</h1>
          </div>
          <p className="text-sm text-slate-400">
            Track your ski journey and conquer the slopes
          </p>
        </div>
        {/* Desktop button and legend */}
        <div className="flex items-center gap-3">
          <SkiTypeInfo />
          <Link
            href="/dashboard/add-day"
            className="btn btn-primary !hidden sm:!inline-flex"
          >
            <Plus className="w-4 h-4" />
            Add Ski Day
          </Link>
        </div>
      </div>

      {/* Calendar */}
      <SkiCalendarWithDialog skiDays={skiDays || []} resorts={resorts} />

      {/* Quick Stats */}
      <StatsCards
        totalDays={stats.totalDays}
        totalHours={stats.totalHours}
        totalDistance={stats.totalDistance}
        avgRating={stats.avgRating}
        uniqueResorts={stats.uniqueResorts}
      />
      <div className="more-stats-grid grid gap-4">
        <MoreStatsCard1 skiDays={skiDays || []} />
        <MoreStatsCard2 skiDays={skiDays || []} />
      </div>
      {/* Mobile fixed button at bottom */}
      <Link
        href="/dashboard/add-day"
        className="btn-mobile btn-primary fixed left-4 right-4 justify-center !inline-flex sm:!hidden"
        style={{ bottom: "calc(var(--sab) + 1rem)" }}
      >
        <Plus className="w-4 h-4" />
        Add Ski Day
      </Link>
    </div>
  );
}
