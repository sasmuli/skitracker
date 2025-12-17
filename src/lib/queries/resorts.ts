import { SupabaseClient } from '@supabase/supabase-js';
import type { Resort } from '@/types';

export async function getResorts(supabase: SupabaseClient): Promise<Resort[]> {
  const { data, error } = await supabase
    .from('resorts')
    .select('id, name, height_m, lifts, skislopes_km, location')
    .order('name');

  if (error) {
    console.error('Error fetching resorts:', error);
    return [];
  }

  return data ?? [];
}
