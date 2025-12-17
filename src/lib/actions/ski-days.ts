'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server-client';
import type { SkiDayInput } from '@/types';

export async function createSkiDays(inputs: SkiDayInput[]) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Not authenticated' };
  }

  const records = inputs.map((input) => ({
    user_id: user.id,
    date: input.date,
    resort_id: input.resort_id,
    hours: input.hours,
    rating: input.rating,
    distance_km: input.distance_km,
    notes: input.notes,
    ski_types: input.ski_types,
  }));

  const { error } = await supabase.from('ski_days').insert(records);

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

export async function deleteSkiDay(id: string) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Not authenticated' };
  }

  const { error } = await supabase
    .from('ski_days')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}
