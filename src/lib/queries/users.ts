import type { SupabaseClient } from "@supabase/supabase-js";

export async function getAdminUsers(supabase: SupabaseClient): Promise<string[]> {
  const { data, error } = await supabase
    .from("profiles")
    .select("id")
    .eq("admin", true);

  if (error) {
    console.error("Error fetching admin users:", error);
    return [];
  }

  return data?.map(profile => profile.id) || [];
}
