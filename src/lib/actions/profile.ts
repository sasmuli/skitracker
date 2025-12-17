'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server-client';
import type { ProfileInput } from '@/types';

export async function updateProfile(input: ProfileInput) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Not authenticated' };
  }

  const { error } = await supabase.from('profiles').upsert({
    id: user.id,
    display_name: input.display_name,
    avatar_url: input.avatar_url,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}
