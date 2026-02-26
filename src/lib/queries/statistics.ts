import type { SupabaseClient } from "@supabase/supabase-js";

export type AggregateStats = {
  totalResorts: number;
  totalCountries: number;
  totalSkiDays: number;
  mostVisitedResort: { name: string; visits: number } | null;
};

export async function getAggregateStatistics(
  supabase: SupabaseClient
): Promise<AggregateStats> {
  try {
    // Call the Edge Function to get statistics (bypasses RLS)
    const { data, error } = await supabase.functions.invoke('get-aggregate-stats');

    if (error) {
      console.error("Error calling get-aggregate-stats function:", error);
      throw error;
    }

    if (!data) {
      throw new Error("No data returned from get-aggregate-stats");
    }

    return {
      totalResorts: data.totalResorts || 0,
      totalCountries: data.totalCountries || 0,
      totalSkiDays: data.totalSkiDays || 0,
      mostVisitedResort: data.mostVisitedResort || null,
    };
  } catch (error) {
    console.error("Error fetching aggregate statistics:", error);
    return {
      totalResorts: 0,
      totalCountries: 0,
      totalSkiDays: 0,
      mostVisitedResort: null,
    };
  }
}
