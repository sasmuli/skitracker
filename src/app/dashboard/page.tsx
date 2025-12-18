import Link from 'next/link';
import { createSupabaseServerClient } from '@/lib/supabase/server-client';
import { SkiCalendar } from '@/components/ski-calendar';
import { Plus } from 'lucide-react';
import { getSkiDays, getSkiDayStats, getCurrentUserWithProfile } from '@/lib/queries';

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  const { user, profile } = await getCurrentUserWithProfile(supabase);
  
  const skiDays = await getSkiDays(supabase, user!.id);
  const stats = getSkiDayStats(skiDays);

  const displayName = profile?.display_name || 'Skier';

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-semibold">Welcome, {displayName}!</h1>
          </div>
          <p className="text-sm text-slate-400">Track your ski journey and conquer the slopes</p>
        </div>
        {/* Desktop button */}
        <Link
          href="/dashboard/add-day"
          className="btn btn-primary !hidden sm:!inline-flex"
        >
          <Plus className="w-4 h-4" />
          Add Ski Day
        </Link>
      </div>

      {/* Calendar */}
      <SkiCalendar skiDays={skiDays || []} />

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card !p-4 text-center">
          <p className="text-2xl font-bold text-sky-400">{stats.totalDays}</p>
          <p className="text-xs text-slate-400">Ski Days</p>
        </div>
        <div className="glass-card !p-4 text-center">
          <p className="text-2xl font-bold text-sky-400">{stats.totalHours.toFixed(1)}</p>
          <p className="text-xs text-slate-400">Total Hours</p>
        </div>
        <div className="glass-card !p-4 text-center">
          <p className="text-2xl font-bold text-sky-400">
            {stats.avgRating ? stats.avgRating.toFixed(1) : '-'}
          </p>
          <p className="text-xs text-slate-400">Avg Rating</p>
        </div>
        <div className="glass-card !p-4 text-center">
          <p className="text-2xl font-bold text-sky-400">{stats.uniqueResorts}</p>
          <p className="text-xs text-slate-400">Resorts</p>
        </div>
      </div>

      {/* Mobile fixed button at bottom */}
      <Link
        href="/dashboard/add-day"
        className="btn-mobile btn-primary fixed bottom-4 left-4 right-4 justify-center !inline-flex sm:!hidden"
      >
        <Plus className="w-4 h-4" />
        Add Ski Day, Mobile
      </Link>
    </div>
  );
}
