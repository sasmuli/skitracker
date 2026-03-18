import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { getSkiDays, getCurrentUserWithProfile, getSkiDayStats } from "@/lib/queries";
import { StatsPageWrapper } from "@/components/stats-page-wrapper";

export default async function StatsPage() {
  const supabase = await createSupabaseServerClient();
  const { user } = await getCurrentUserWithProfile(supabase);
  
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <p className="text-[var(--color-text-muted)]">Please sign in to view your stats</p>
      </div>
    );
  }
  
  const skiDays = await getSkiDays(supabase, user.id);
  const stats = getSkiDayStats(skiDays);
  
  // Calculate all statistics
  const totalDistance = stats.totalDistance;
  const totalHours = stats.totalHours;
  const totalDays = stats.totalDays;
  const avgRating = stats.avgRating || 0;
  const uniqueResorts = stats.uniqueResorts;
  
  const earthCircumference = 40075;
  const earthPercent = ((totalDistance / earthCircumference) * 100).toFixed(2);
  
  const finlandLength = 1160;
  const finlandTimes = (totalDistance / finlandLength).toFixed(1);
  
  const helsinkiRovaniemi = 830;
  const helsinkiRovaniemiTimes = (totalDistance / helsinkiRovaniemi).toFixed(1);
  
  const marathon = 42.195;
  const marathons = Math.round(totalDistance / marathon);
  
  const avgSpeed = totalHours > 0 ? (totalDistance / totalHours).toFixed(1) : '0';
  const avgDayLength = totalDays > 0 ? (totalHours / totalDays).toFixed(1) : '0';
  
  const workdays = Math.round(totalHours / 8);
  const nonStopDays = (totalHours / 24).toFixed(1);
  
  const avgDistancePerResort = uniqueResorts > 0 ? Math.round(totalDistance / uniqueResorts) : 0;
  const avgHoursPerResort = uniqueResorts > 0 ? (totalHours / uniqueResorts).toFixed(1) : '0';
  
  const moonDistance = 384400;
  const moonPercent = ((totalDistance / moonDistance) * 100).toFixed(2);
  
  const caloriesBurned = Math.round(totalHours * 400);
  const pullaBuns = Math.round(caloriesBurned / 225);
  
  // Additional stats from stats.md
  const tourDeFrance = 3500;
  const tourPercent = ((totalDistance / tourDeFrance) * 100).toFixed(1);
  
  const everestHeight = 8.848;
  const everestClimbs = Math.round(totalDistance / everestHeight);
  
  const lakeSaimaa = 14850;
  const saimaaPercent = ((totalDistance / lakeSaimaa) * 100).toFixed(1);
  
  // Best single day
  const bestDay = skiDays.reduce((max, day) => Math.max(max, day.distance_km || 0), 0);
  
  // Resort discovery rate
  const resortDiscoveryRate = uniqueResorts > 0 ? (totalDays / uniqueResorts).toFixed(1) : '0';
  
  // Distance per hour efficiency
  const distancePerHour = totalHours > 0 ? (totalDistance / totalHours).toFixed(1) : '0';
  
  // Adventure ratio
  const adventureRatio = totalDays > 0 ? (uniqueResorts / totalDays).toFixed(2) : '0';
  
  // Favorite resort share
  const resortCounts = skiDays.reduce((acc, day) => {
    if (day.resort?.name) {
      acc[day.resort.name] = (acc[day.resort.name] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);
  const favoriteResort = Object.entries(resortCounts).sort((a, b) => b[1] - a[1])[0];
  const favoriteResortName = favoriteResort?.[0] || 'N/A';
  const favoriteResortShare = favoriteResort ? ((favoriteResort[1] / totalDays) * 100).toFixed(0) : '0';
  
  // Rating consistency
  const highRatedDays = skiDays.filter(d => (d.rating || 0) >= 4).length;
  const ratingConsistency = totalDays > 0 ? ((highRatedDays / totalDays) * 100).toFixed(0) : '0';
  
  // Ski type distribution
  const skiTypeCount = skiDays.reduce((acc, day) => {
    if (day.ski_types && Array.isArray(day.ski_types)) {
      day.ski_types.forEach(type => {
        acc[type] = (acc[type] || 0) + 1;
      });
    }
    return acc;
  }, {} as Record<string, number>);
  const totalTypeEntries = Object.values(skiTypeCount).reduce((sum, count) => sum + count, 0);
  const skiTypeDistribution = totalTypeEntries > 0 ? Object.entries(skiTypeCount).map(([type, count]) => ({
    type,
    percentage: ((count / totalTypeEntries) * 100).toFixed(0)
  })).sort((a, b) => parseInt(b.percentage) - parseInt(a.percentage)) : [];
  
  // Terrain versatility
  const usedTypes = Object.keys(skiTypeCount).length;
  const totalTypes = 5; // Piste, Park, Freeride, Touring, Street
  const versatility = `${usedTypes}/${totalTypes}`;
  
  // Chart data
  const marathonData = [
    { name: 'Completed', value: marathons, fill: '#8b5cf6' },
    { name: 'To Next', value: Math.max(1, 5 - (marathons % 5)), fill: '#1f1f2e' }
  ];
  
  const speedData = [
    { name: 'Your Speed', speed: parseFloat(avgSpeed), fill: '#8b5cf6' },
    { name: 'Avg Skier', speed: 15, fill: '#6366f1' }
  ];
  const resortData = [
    { name: 'Visited', value: uniqueResorts, fill: '#8b5cf6' },
    { name: 'To Explore', value: Math.max(1, 20 - uniqueResorts), fill: '#1f1f2e' }
  ];

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <StatsPageWrapper
          skiDays={skiDays}
          totalDistance={totalDistance}
          totalHours={totalHours}
          totalDays={totalDays}
          avgRating={avgRating}
          uniqueResorts={uniqueResorts}
          earthPercent={earthPercent}
          finlandTimes={finlandTimes}
          helsinkiRovaniemiTimes={helsinkiRovaniemiTimes}
          marathons={marathons}
          avgSpeed={avgSpeed}
          avgDayLength={avgDayLength}
          workdays={workdays}
          nonStopDays={nonStopDays}
          avgDistancePerResort={avgDistancePerResort}
          avgHoursPerResort={avgHoursPerResort}
          moonPercent={moonPercent}
          caloriesBurned={caloriesBurned}
          pullaBuns={pullaBuns}
          tourPercent={tourPercent}
          everestClimbs={everestClimbs}
          saimaaPercent={saimaaPercent}
          bestDay={bestDay}
          resortDiscoveryRate={resortDiscoveryRate}
          distancePerHour={distancePerHour}
          adventureRatio={adventureRatio}
          favoriteResortName={favoriteResortName}
          favoriteResortShare={favoriteResortShare}
          ratingConsistency={ratingConsistency}
          skiTypeDistribution={skiTypeDistribution}
          versatility={versatility}
        />
      </div>
    </div>
  );
}