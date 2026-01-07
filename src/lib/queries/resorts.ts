import { SupabaseClient } from '@supabase/supabase-js';
import type { Resort } from '@/types';

export async function getResorts(supabase: SupabaseClient): Promise<Resort[]> {
  const { data, error } = await supabase
    .from('resorts')
    .select('id, name, height_m, lifts, skislopes_km, location_area, location_city, location_country')
    .eq('approved', true)
    .order('name');

  if (error) {
    console.error('Error fetching resorts:', error);
    return [];
  }

  return data ?? [];
}
