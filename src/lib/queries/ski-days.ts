import { SupabaseClient } from '@supabase/supabase-js';
import type { SkiDay } from '@/types';

export async function getSkiDays(supabase: SupabaseClient, userId: string): Promise<SkiDay[]> {
  const { data, error } = await supabase
    .from('ski_days')
    .select(`
      id,
      date,
      hours,
      rating,
      ski_types,
      resorts!ski_days_resort_id_fkey (
        id,
        name
      )
    `)
    .eq('user_id', userId)
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching ski days:', error);
    return [];
  }

  return data?.map(day => ({
    id: day.id,
    date: day.date,
    hours: day.hours,
    rating: day.rating,
    ski_types: day.ski_types,
    resort: (day.resorts as unknown) as { id: string; name: string } | null,
  })) ?? [];
}

export function getSkiDayStats(skiDays: SkiDay[]) {
  const totalDays = skiDays.length;
  const totalHours = skiDays.reduce((sum, d) => sum + (d.hours || 0), 0);
  const avgRating = skiDays.length
    ? skiDays.reduce((sum, d) => sum + (d.rating || 0), 0) / skiDays.filter(d => d.rating).length
    : null;
  const uniqueResorts = new Set(skiDays.filter(d => d.resort).map(d => d.resort?.id)).size;

  return { totalDays, totalHours, avgRating, uniqueResorts };
}
