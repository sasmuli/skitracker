import { SupabaseClient } from '@supabase/supabase-js';
import type { Profile } from '@/types';

export async function getProfile(
  supabase: SupabaseClient,
  userId: string
): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, display_name, avatar_url, created_at, admin')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }

  return data;
}

export async function getCurrentUserWithProfile(supabase: SupabaseClient) {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { user: null, profile: null };
  }

  const profile = await getProfile(supabase, user.id);
  
  return { user, profile };
}
