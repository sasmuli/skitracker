"use client";

import { StatPageCard } from "@/components/stat-page-card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, RadialBarChart, RadialBar, Legend } from 'recharts';

export type FilterCategory = 'all' | 'distance' | 'endurance' | 'resort' | 'quality' | 'types' | 'fun';

interface StatsGridProps {
  totalDistance: number;
  totalHours: number;
  totalDays: number;
  avgRating: number;
  uniqueResorts: number;
  earthPercent: string;
  finlandTimes: string;
  helsinkiRovaniemiTimes: string;
  marathons: number;
  avgSpeed: string;
  avgDayLength: string;
  workdays: number;
  nonStopDays: string;
  avgDistancePerResort: number;
  avgHoursPerResort: string;
  moonPercent: string;
  caloriesBurned: number;
  pullaBuns: number;
  tourPercent: string;
  everestClimbs: number;
  saimaaPercent: string;
  bestDay: number;
  resortDiscoveryRate: string;
  distancePerHour: string;
  adventureRatio: string;
  favoriteResortName: string;
  favoriteResortShare: string;
  ratingConsistency: string;
  skiTypeDistribution: Array<{ type: string; percentage: string }>;
  versatility: string;
  activeFilter?: FilterCategory;
}

export function StatsGrid(props: StatsGridProps) {
  const {
    totalDistance,
    totalDays,
    earthPercent,
    finlandTimes,
    helsinkiRovaniemiTimes,
    marathons,
    avgSpeed,
    avgDayLength,
    workdays,
    nonStopDays,
    uniqueResorts,
    avgDistancePerResort,
    avgHoursPerResort,
    avgRating,
    moonPercent,
    caloriesBurned,
    pullaBuns,
    tourPercent,
    everestClimbs,
    saimaaPercent,
    bestDay,
    resortDiscoveryRate,
    distancePerHour,
    adventureRatio,
    favoriteResortName,
    favoriteResortShare,
    ratingConsistency,
    skiTypeDistribution,
    versatility,
    activeFilter = 'all'
  } = props;

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

  const earthData = [
    { name: 'Progress', value: parseFloat(earthPercent), fill: '#8b5cf6' },
    { name: 'Remaining', value: Math.max(0, 100 - parseFloat(earthPercent)) , fill: '#1f1f2e' }
  ];

  const workdayData = [
    { name: 'Days', value: workdays, fill: '#8b5cf6' }
  ];

  const ratingData = [
    { name: 'Rating', value: avgRating, fill: '#8b5cf6' }
  ];

  // Prepare ski type distribution text
  const skiTypeText = skiTypeDistribution.length > 0 
    ? skiTypeDistribution.map(t => `${t.percentage}% ${t.type}`).join(', ')
    : 'No ski type data';

  const everestHeight = 8.848;
  const everestClimbsDecimal = totalDistance / everestHeight;
  
  const finlandLength = 1160;
  const finlandTimesDecimal = totalDistance / finlandLength;
  
  const helsinkiRovaniemiDistance = 830;
  const helsinkiRovaniemiTimesDecimal = totalDistance / helsinkiRovaniemiDistance;

  // Filter helper function
  const shouldShowSection = (category: FilterCategory) => {
    return activeFilter === 'all' || activeFilter === category;
  };

  return (
    <div className="space-y-12">
      
      {/* DISTANCE SECTION */}
      {shouldShowSection('distance') && (
      <div>
        <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          🌍 Distance
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
      {/* Distance: Around the World */}
      <StatPageCard
        category="Distance"
        title="Around the Earth"
        value={`${earthPercent}%`}
        description={`You've skied ${Math.round(totalDistance * 10) / 10} km — that's ${earthPercent}% around the Earth 🌍`}
        icon="🌍"
        chart={
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={earthData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={70}
                paddingAngle={5}
                dataKey="value"
              >
                {earthData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  background: 'linear-gradient(to bottom right, rgba(39, 39, 39, 0.95) 20%, rgba(0, 0, 0, 0.9) 65%)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.07)',
                  borderRadius: '8px',
                  boxShadow: '0 6px 16px rgba(0, 0, 0, 0.25)'
                }}
                labelStyle={{ color: '#fff' }}
                itemStyle={{ color: '#fff' }}
                formatter={(value, name) => [`${Number(value).toFixed(1)}%`, name]}
              />
            </PieChart>
          </ResponsiveContainer>
        }
      />

      {/* Distance: Finland */}
      <StatPageCard
        category="Distance"
        title="Length of Finland"
        value={`${finlandTimes}×`}
        description={`You've skied the length of Finland ${finlandTimes} times (1160 km)`}
        icon="🇫🇮"
        chart={
          <div className="flex flex-col justify-center h-full px-4">
            <div className="mb-2">
              <div className="flex justify-between items-center mb-2">
                <p className="text-xs text-[rgba(255,255,255,0.5)]">Progress to next milestone</p>
                <p className="text-sm font-semibold text-purple-400">
                  {((finlandTimesDecimal % 1) * 100).toFixed(0)}%
                </p>
              </div>
              <div className="relative h-3 bg-[rgba(255,255,255,0.05)] rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full transition-all duration-500"
                  style={{ width: `${(finlandTimesDecimal % 1) * 100}%` }}
                />
              </div>
              <p className="text-xs text-[rgba(255,255,255,0.4)] mt-1 text-right">
                {(totalDistance % finlandLength).toFixed(1)} km of {finlandLength} km
              </p>
            </div>
          </div>
        }
      />

      {/* Distance: Helsinki → Rovaniemi */}
      <StatPageCard
        category="Distance"
        title="Helsinki → Rovaniemi"
        value={`${helsinkiRovaniemiTimes}×`}
        description={`You could ski from Helsinki to Rovaniemi ${helsinkiRovaniemiTimes} times (830 km)`}
        icon="🚂"
        chart={
          <div className="flex flex-col justify-center h-full px-4">
            <div className="mb-2">
              <div className="flex justify-between items-center mb-2">
                <p className="text-xs text-[rgba(255,255,255,0.5)]">Progress to next milestone</p>
                <p className="text-sm font-semibold text-indigo-400">
                  {((helsinkiRovaniemiTimesDecimal % 1) * 100).toFixed(0)}%
                </p>
              </div>
              <div className="relative h-3 bg-[rgba(255,255,255,0.05)] rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full transition-all duration-500"
                  style={{ width: `${(helsinkiRovaniemiTimesDecimal % 1) * 100}%` }}
                />
              </div>
              <p className="text-xs text-[rgba(255,255,255,0.4)] mt-1 text-right">
                {(totalDistance % helsinkiRovaniemiDistance).toFixed(1)} km of {helsinkiRovaniemiDistance} km
              </p>
            </div>
          </div>
        }
      />

      {/* Tour de France */}
      <StatPageCard
        category="Distance"
        title="Tour de France"
        value={`${tourPercent}%`}
        description={`You've skied ${tourPercent}% of the Tour de France (3,500 km)`}
        icon="🚴"
        chart={
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={[
                  { name: 'Progress', value: parseFloat(tourPercent), fill: '#eab308' },
                  { name: 'Remaining', value: Math.max(0, 100 - parseFloat(tourPercent)), fill: '#1f1f2e' }
                ]}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={70}
                paddingAngle={5}
                dataKey="value"
              >
                <Cell key="cell-0" fill="#eab308" />
                <Cell key="cell-1" fill="#1f1f2e" />
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  background: 'linear-gradient(to bottom right, rgba(39, 39, 39, 0.95) 20%, rgba(0, 0, 0, 0.9) 65%)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.07)',
                  borderRadius: '8px',
                  boxShadow: '0 6px 16px rgba(0, 0, 0, 0.25)'
                }}
                labelStyle={{ color: '#fff' }}
                itemStyle={{ color: '#fff' }}
                formatter={(value, name) => [`${((Number(value) / 100) * 3500).toFixed(1)} km`, name]}
              />
            </PieChart>
          </ResponsiveContainer>
        }
      />

      {/* Distance Per Hour */}
      <StatPageCard
        category="Distance"
        title="Distance Per Hour"
        value={`${distancePerHour} km/h`}
        description={`You ski ${distancePerHour} km for every hour on snow`}
        icon="⚡"
        chart={
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart 
              cx="50%" 
              cy="50%" 
              innerRadius="60%" 
              outerRadius="90%" 
              data={[{ 
                name: 'Your Speed', 
                value: parseFloat(distancePerHour), 
                fill: '#22c55e' 
              }]}
              startAngle={180}
              endAngle={0}
            >
              <RadialBar
                background={{ fill: 'rgba(255,255,255,0.05)' }}
                dataKey="value"
                cornerRadius={10}
              />
              <Tooltip 
                contentStyle={{ 
                  background: 'linear-gradient(to bottom right, rgba(39, 39, 39, 0.95) 20%, rgba(0, 0, 0, 0.9) 65%)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.07)',
                  borderRadius: '8px',
                  boxShadow: '0 6px 16px rgba(0, 0, 0, 0.25)'
                }}
                labelStyle={{ display: 'none' }}
                itemStyle={{ color: '#fff' }}
                formatter={(value) => [`${(Number(value) / 3.6).toFixed(1)} m/s`, 'Your Speed']}
              />
              <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="fill-white text-2xl font-bold">
                {parseFloat(distancePerHour).toFixed(1)}
              </text>
              <text x="50%" y="60%" textAnchor="middle" dominantBaseline="middle" className="fill-gray-400 text-xs">
                km/h
              </text>
            </RadialBarChart>
          </ResponsiveContainer>
        }
      />

      {/* Everest Climbs */}
      <StatPageCard
        category="Distance"
        title="Everest Climbs"
        value={`${everestClimbs}×`}
        description={`Your distance equals climbing Everest ${everestClimbs} times (8.848 km height)`}
        icon="🏔️"
        chart={
          <div className="flex flex-col justify-center h-full px-4">
            <div className="mb-2">
              <div className="flex justify-between items-center mb-2">
                <p className="text-xs text-[rgba(255,255,255,0.5)]">Progress to next milestone</p>
                <p className="text-sm font-semibold text-slate-400">
                  {((everestClimbsDecimal % 1) * 100).toFixed(0)}%
                </p>
              </div>
              <div className="relative h-3 bg-[rgba(255,255,255,0.05)] rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-slate-500 to-slate-600 rounded-full transition-all duration-500"
                  style={{ width: `${(everestClimbsDecimal % 1) * 100}%` }}
                />
              </div>
              <p className="text-xs text-[rgba(255,255,255,0.4)] mt-1 text-right">
                {(totalDistance % everestHeight).toFixed(1)} km of {everestHeight} km
              </p>
            </div>
          </div>
        }
      />

      {/* Lake Saimaa */}
      <StatPageCard
        category="Distance"
        title="Around Lake Saimaa"
        value={`${saimaaPercent}%`}
        description={`You've skied ${saimaaPercent}% around Lake Saimaa shoreline (14,850 km)`}
        icon="🌊"
        chart={
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={[
                  { name: 'Progress', value: parseFloat(saimaaPercent), fill: '#06b6d4' },
                  { name: 'Remaining', value: Math.max(0, 100 - parseFloat(saimaaPercent)), fill: '#1f1f2e' }
                ]}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={70}
                paddingAngle={5}
                dataKey="value"
              >
                <Cell key="cell-0" fill="#06b6d4" />
                <Cell key="cell-1" fill="#1f1f2e" />
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  background: 'linear-gradient(to bottom right, rgba(39, 39, 39, 0.95) 20%, rgba(0, 0, 0, 0.9) 65%)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.07)',
                  borderRadius: '8px',
                  boxShadow: '0 6px 16px rgba(0, 0, 0, 0.25)'
                }}
                labelStyle={{ color: '#fff' }}
                itemStyle={{ color: '#fff' }}
                formatter={(value, name) => [`${Number(value).toFixed(1)}%`, name]}
              />
            </PieChart>
          </ResponsiveContainer>
        }
      />

      {/* Journey to the Moon */}
      <StatPageCard
        category="Distance"
        title="Journey to the Moon"
        value={`${moonPercent}%`}
        description={`You're ${moonPercent}% of the way to the Moon 🚀 (384,400 km)`}
        icon="🌙"
        chart={
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={[
                  { name: 'Progress', value: parseFloat(moonPercent), fill: '#8b5cf6' },
                  { name: 'To Go', value: Math.max(0, 100 - parseFloat(moonPercent)), fill: '#1f1f2e' }
                ]}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={70}
                paddingAngle={5}
                dataKey="value"
              >
                <Cell key="cell-0" fill="#8b5cf6" />
                <Cell key="cell-1" fill="#1f1f2e" />
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  background: 'linear-gradient(to bottom right, rgba(39, 39, 39, 0.95) 20%, rgba(0, 0, 0, 0.9) 65%)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.07)',
                  borderRadius: '8px',
                  boxShadow: '0 6px 16px rgba(0, 0, 0, 0.25)'
                }}
                labelStyle={{ color: '#fff' }}
                itemStyle={{ color: '#fff' }}
                formatter={(value, name) => [`${Number(value).toFixed(1)}%`, name]}
              />
            </PieChart>
          </ResponsiveContainer>
        }
      />

        </div>
      </div>
      )}

      {/* ENDURANCE & TIME SECTION */}
      {shouldShowSection('endurance') && (
      <div>
        <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
          ⏱️ Endurance & Time
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

      {/* Endurance: Marathons with Chart */}
      <StatPageCard
        category="Endurance"
        title="Ski Marathons"
        value={marathons}
        description={`That's ${marathons} ski marathons completed!`}
        icon="🏃"
        chart={
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={marathonData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={70}
                paddingAngle={5}
                dataKey="value"
              >
                {marathonData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  background: 'linear-gradient(to bottom right, rgba(39, 39, 39, 0.95) 20%, rgba(0, 0, 0, 0.9) 65%)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.07)',
                  borderRadius: '8px',
                  boxShadow: '0 6px 16px rgba(0, 0, 0, 0.25)'
                }}
                labelStyle={{ color: '#fff' }}
              />
            </PieChart>
          </ResponsiveContainer>
        }
      />

      {/* Speed with Chart */}
      <StatPageCard
        category="Performance"
        title="Average Speed"
        value={`${avgSpeed} km/h`}
        description={`Your average skiing speed`}
        icon="💨"
        chart={
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={speedData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
              <YAxis stroke="rgba(255,255,255,0.5)" />
              <Tooltip 
                contentStyle={{ 
                  background: 'linear-gradient(to bottom right, rgba(39, 39, 39, 0.95) 20%, rgba(0, 0, 0, 0.9) 65%)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.07)',
                  borderRadius: '8px',
                  boxShadow: '0 6px 16px rgba(0, 0, 0, 0.25)'
                }}
                labelStyle={{ color: '#fff' }}
              />
              <Bar dataKey="speed" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        }
      />

      {/* Time: Average Day Length */}
      <StatPageCard
        category="Time"
        title="Average Ski Day"
        value={`${avgDayLength} hours`}
        description={`Your average ski day lasts ${avgDayLength} hours`}
        icon="⏱️"
        chart={
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={[{ name: 'Avg Day', hours: parseFloat(avgDayLength) }]}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
              <YAxis stroke="rgba(255,255,255,0.5)" />
              <Tooltip 
                contentStyle={{ 
                  background: 'linear-gradient(to bottom right, rgba(39, 39, 39, 0.95) 20%, rgba(0, 0, 0, 0.9) 65%)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.07)',
                  borderRadius: '8px',
                  boxShadow: '0 6px 16px rgba(0, 0, 0, 0.25)'
                }}
                labelStyle={{ color: '#fff' }}
              />
              <Bar dataKey="hours" fill="#0ea5e9" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        }
      />

      {/* Time: Workdays */}
      <StatPageCard
        category="Time"
        title="Workday Equivalents"
        value={`${workdays} days`}
        description={`You've skied the equivalent of ${workdays} full 8-hour workdays`}
        icon="💼"
        chart={
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={workdayData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
              <YAxis stroke="rgba(255,255,255,0.5)" />
              <Tooltip 
                contentStyle={{ 
                  background: 'linear-gradient(to bottom right, rgba(39, 39, 39, 0.95) 20%, rgba(0, 0, 0, 0.9) 65%)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.07)',
                  borderRadius: '8px',
                  boxShadow: '0 6px 16px rgba(0, 0, 0, 0.25)'
                }}
                labelStyle={{ color: '#fff' }}
              />
              <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        }
      />

      {/* Time: Non-Stop */}
      <StatPageCard
        category="Endurance"
        title="Non-Stop Skiing"
        value={`${nonStopDays} days`}
        description={`If you skied non-stop, you'd be on the slopes for ${nonStopDays} days straight`}
        icon="🔥"
        chart={
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={[{ name: 'Non-Stop', days: parseFloat(nonStopDays) }]}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
              <YAxis stroke="rgba(255,255,255,0.5)" />
              <Tooltip 
                contentStyle={{ 
                  background: 'linear-gradient(to bottom right, rgba(39, 39, 39, 0.95) 20%, rgba(0, 0, 0, 0.9) 65%)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.07)',
                  borderRadius: '8px',
                  boxShadow: '0 6px 16px rgba(0, 0, 0, 0.25)'
                }}
                labelStyle={{ color: '#fff' }}
              />
              <Bar dataKey="days" fill="#f59e0b" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        }
      />

        </div>
      </div>
      )}

      {/* RESORT EXPLORATION SECTION */}
      {shouldShowSection('resort') && (
      <div>
        <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
          🏔️ Resort Exploration
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

      {/* Resorts with Chart */}
      <StatPageCard
        category="Exploration"
        title="Resorts Visited"
        value={uniqueResorts}
        description={`You've visited ${uniqueResorts} different ski resorts`}
        icon="🎿"
        chart={
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={resortData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={70}
                paddingAngle={5}
                dataKey="value"
              >
                {resortData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  background: 'linear-gradient(to bottom right, rgba(39, 39, 39, 0.95) 20%, rgba(0, 0, 0, 0.9) 65%)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.07)',
                  borderRadius: '8px',
                  boxShadow: '0 6px 16px rgba(0, 0, 0, 0.25)'
                }}
                labelStyle={{ color: '#fff' }}
              />
            </PieChart>
          </ResponsiveContainer>
        }
      />

      {/* Resort Efficiency */}
      <StatPageCard
        category="Efficiency"
        title="Distance Per Resort"
        value={`${avgDistancePerResort} km`}
        description={`You average ${avgDistancePerResort} km at each resort`}
        icon="📊"
        chart={
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={[{ name: 'Avg', km: avgDistancePerResort }]}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
              <YAxis stroke="rgba(255,255,255,0.5)" />
              <Tooltip 
                contentStyle={{ 
                  background: 'linear-gradient(to bottom right, rgba(39, 39, 39, 0.95) 20%, rgba(0, 0, 0, 0.9) 65%)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.07)',
                  borderRadius: '8px',
                  boxShadow: '0 6px 16px rgba(0, 0, 0, 0.25)'
                }}
                labelStyle={{ color: '#fff' }}
              />
              <Bar dataKey="km" fill="#10b981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        }
      />

      {/* Hours Per Resort */}
      <StatPageCard
        category="Efficiency"
        title="Hours Per Resort"
        value={`${avgHoursPerResort}h`}
        description={`You average ${avgHoursPerResort} hours of skiing at each resort`}
        icon="⏰"
        chart={
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={[{ name: 'Avg Hours', hours: parseFloat(avgHoursPerResort) }]}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
              <YAxis stroke="rgba(255,255,255,0.5)" />
              <Tooltip 
                contentStyle={{ 
                  background: 'linear-gradient(to bottom right, rgba(39, 39, 39, 0.95) 20%, rgba(0, 0, 0, 0.9) 65%)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.07)',
                  borderRadius: '8px',
                  boxShadow: '0 6px 16px rgba(0, 0, 0, 0.25)'
                }}
                labelStyle={{ color: '#fff' }}
              />
              <Bar dataKey="hours" fill="#ec4899" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        }
      />

      {/* Resort Discovery Rate */}
      <StatPageCard
        category="Exploration"
        title="Resort Discovery Rate"
        value={`${resortDiscoveryRate} days`}
        description={`You discover a new resort every ${resortDiscoveryRate} ski days`}
        icon="🗺️"
        chart={
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={[{ name: 'Discovery', days: parseFloat(resortDiscoveryRate) }]}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
              <YAxis stroke="rgba(255,255,255,0.5)" />
              <Tooltip 
                contentStyle={{ 
                  background: 'linear-gradient(to bottom right, rgba(39, 39, 39, 0.95) 20%, rgba(0, 0, 0, 0.9) 65%)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.07)',
                  borderRadius: '8px',
                  boxShadow: '0 6px 16px rgba(0, 0, 0, 0.25)'
                }}
                labelStyle={{ color: '#fff' }}
              />
              <Bar dataKey="days" fill="#14b8a6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        }
      />

      {/* Favorite Resort Share */}
      <StatPageCard
        category="Exploration"
        title="Favorite Resort"
        value={`${favoriteResortShare}%`}
        description={`${favoriteResortShare}% of all your skiing happened at ${favoriteResortName}`}
        icon="❤️"
        chart={
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={[
                  { name: favoriteResortName, value: parseInt(favoriteResortShare), fill: '#ef4444' },
                  { name: 'Others', value: Math.max(0, 100 - parseInt(favoriteResortShare)), fill: '#1f1f2e' }
                ]}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={70}
                paddingAngle={5}
                dataKey="value"
              >
                <Cell key="cell-0" fill="#ef4444" />
                <Cell key="cell-1" fill="#1f1f2e" />
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  background: 'linear-gradient(to bottom right, rgba(39, 39, 39, 0.95) 20%, rgba(0, 0, 0, 0.9) 65%)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.07)',
                  borderRadius: '8px',
                  boxShadow: '0 6px 16px rgba(0, 0, 0, 0.25)'
                }}
                labelStyle={{ color: '#fff' }}
              />
            </PieChart>
          </ResponsiveContainer>
        }
      />

      {/* Adventure Ratio */}
      <StatPageCard
        category="Exploration"
        title="Adventure Ratio"
        value={adventureRatio}
        description={`${adventureRatio} resorts per ski day - higher means you explore new places often`}
        icon="🧭"
        chart={
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={[{ name: 'Ratio', value: parseFloat(adventureRatio) }]}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
              <YAxis stroke="rgba(255,255,255,0.5)" domain={[0, 1]} />
              <Tooltip 
                contentStyle={{ 
                  background: 'linear-gradient(to bottom right, rgba(39, 39, 39, 0.95) 20%, rgba(0, 0, 0, 0.9) 65%)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.07)',
                  borderRadius: '8px',
                  boxShadow: '0 6px 16px rgba(0, 0, 0, 0.25)'
                }}
                labelStyle={{ color: '#fff' }}
              />
              <Bar dataKey="value" fill="#a855f7" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        }
      />

        </div>
      </div>
      )}

      {/* QUALITY AND PERFORMANCE SECTION */}
      {shouldShowSection('quality') && (
      <div>
        <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
          ⭐ Quality and Performance
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

      {/* Quality: Rating */}
      <StatPageCard
        category="Quality"
        title="Average Rating"
        value={`${avgRating.toFixed(1)}⭐`}
        description={`Your average ski day rating`}
        icon="⭐"
        chart={
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ratingData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
              <YAxis domain={[0, 5]} stroke="rgba(255,255,255,0.5)" />
              <Tooltip 
                contentStyle={{ 
                  background: 'linear-gradient(to bottom right, rgba(39, 39, 39, 0.95) 20%, rgba(0, 0, 0, 0.9) 65%)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.07)',
                  borderRadius: '8px',
                  boxShadow: '0 6px 16px rgba(0, 0, 0, 0.25)'
                }}
                labelStyle={{ color: '#fff' }}
              />
              <Bar dataKey="value" fill="#fbbf24" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        }
      />

      {/* Rating Consistency */}
      <StatPageCard
        category="Quality"
        title="Rating Consistency"
        value={`${ratingConsistency}%`}
        description={`${ratingConsistency}% of days rated 4 or higher`}
        icon="🎯"
        chart={
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={[
                  { name: '4+ Stars', value: parseInt(ratingConsistency), fill: '#eab308' },
                  { name: 'Below 4', value: Math.max(0, 100 - parseInt(ratingConsistency)), fill: '#1f1f2e' }
                ]}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={70}
                paddingAngle={5}
                dataKey="value"
              >
                <Cell key="cell-0" fill="#eab308" />
                <Cell key="cell-1" fill="#1f1f2e" />
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  background: 'linear-gradient(to bottom right, rgba(39, 39, 39, 0.95) 20%, rgba(0, 0, 0, 0.9) 65%)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.07)',
                  borderRadius: '8px',
                  boxShadow: '0 6px 16px rgba(0, 0, 0, 0.25)'
                }}
                labelStyle={{ color: '#fff' }}
              />
            </PieChart>
          </ResponsiveContainer>
        }
      />

      {/* Best Single Day */}
      <StatPageCard
        category="Performance"
        title="Best Single Day"
        value={`${bestDay} km`}
        description={`Your longest day covered ${bestDay} km`}
        icon="🏆"
        chart={
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={[{ name: 'Best', km: bestDay }]}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
              <YAxis stroke="rgba(255,255,255,0.5)" />
              <Tooltip 
                contentStyle={{ 
                  background: 'linear-gradient(to bottom right, rgba(39, 39, 39, 0.95) 20%, rgba(0, 0, 0, 0.9) 65%)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.07)',
                  borderRadius: '8px',
                  boxShadow: '0 6px 16px rgba(0, 0, 0, 0.25)'
                }}
                labelStyle={{ color: '#fff' }}
              />
              <Bar dataKey="km" fill="#d946ef" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        }
      />

        </div>
      </div>
      )}

      {/* SKI TYPE SECTION */}
      {shouldShowSection('types') && (
      <div>
        <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
          🎿 Ski Type
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

      {/* Style Distribution */}
      <StatPageCard
        category="Ski Type"
        title="Style Distribution"
        value={skiTypeDistribution.length > 0 ? `${skiTypeDistribution.length} types` : 'N/A'}
        description={skiTypeText}
        icon="📊"
        chart={
          <ResponsiveContainer width="100%" height="100%">
            {skiTypeDistribution.length > 0 ? (
              <PieChart>
                <Pie
                  data={skiTypeDistribution.map(t => ({ name: t.type, value: parseInt(t.percentage) }))}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                  label
                >
                  {skiTypeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'][index % 5]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    background: 'linear-gradient(to bottom right, rgba(39, 39, 39, 0.95) 20%, rgba(0, 0, 0, 0.9) 65%)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255, 255, 255, 0.07)',
                    borderRadius: '8px',
                    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.25)'
                  }}
                  labelStyle={{ color: '#fff' }}
                />
              </PieChart>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">No data</div>
            )}
          </ResponsiveContainer>
        }
      />

      {/* Terrain Versatility */}
      <StatPageCard
        category="Ski Type"
        title="Terrain Versatility"
        value={versatility}
        description={`You've tried ${versatility} ski styles — ${parseInt(versatility.split('/')[0]) >= 4 ? 'highly versatile!' : 'keep exploring!'}`}
        icon="🌟"
        chart={
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={[{ name: 'Types Used', value: parseInt(versatility.split('/')[0]), max: 5 }]}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
              <YAxis domain={[0, 5]} stroke="rgba(255,255,255,0.5)" />
              <Tooltip 
                contentStyle={{ 
                  background: 'linear-gradient(to bottom right, rgba(39, 39, 39, 0.95) 20%, rgba(0, 0, 0, 0.9) 65%)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.07)',
                  borderRadius: '8px',
                  boxShadow: '0 6px 16px rgba(0, 0, 0, 0.25)'
                }}
                labelStyle={{ color: '#fff' }}
              />
              <Bar dataKey="value" fill="#a855f7" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        }
      />

        </div>
      </div>
      )}

      {/* FUN SECTION */}
      {shouldShowSection('fun') && (
      <div>
        <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">
          🔥 Fun
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

      {/* Fun: Calories */}
      <StatPageCard
        category="Fun Fact"
        title="Calories Burned"
        value={`${pullaBuns} pulla`}
        description={`You've burned ~${caloriesBurned.toLocaleString()} kcal — about ${pullaBuns} pulla buns 🥐`}
        icon="🔥"
        chart={
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={[{ name: 'Pulla Buns', count: pullaBuns }]}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
              <YAxis stroke="rgba(255,255,255,0.5)" />
              <Tooltip 
                contentStyle={{ 
                  background: 'linear-gradient(to bottom right, rgba(39, 39, 39, 0.95) 20%, rgba(0, 0, 0, 0.9) 65%)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.07)',
                  borderRadius: '8px',
                  boxShadow: '0 6px 16px rgba(0, 0, 0, 0.25)'
                }}
                labelStyle={{ color: '#fff' }}
              />
              <Bar dataKey="count" fill="#f97316" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        }
      />

      {/* Ski Days Per Year */}
      <StatPageCard
        category="Fun Fact"
        title="Ski Addict Level"
        value={totalDays >= 50 ? "🔥 Obsessed" : totalDays >= 30 ? "😍 Enthusiast" : totalDays >= 15 ? "😊 Regular" : "🎿 Casual"}
        description={`${totalDays} ski days total — you're a ${totalDays >= 30 ? 'serious' : 'dedicated'} skier!`}
        icon="⛷️"
        chart={
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={[{ name: 'Your Days', days: totalDays, threshold: 50 }]}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
              <YAxis stroke="rgba(255,255,255,0.5)" />
              <Tooltip 
                contentStyle={{ 
                  background: 'linear-gradient(to bottom right, rgba(39, 39, 39, 0.95) 20%, rgba(0, 0, 0, 0.9) 65%)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.07)',
                  borderRadius: '8px',
                  boxShadow: '0 6px 16px rgba(0, 0, 0, 0.25)'
                }}
                labelStyle={{ color: '#fff' }}
              />
              <Bar dataKey="days" fill="#ec4899" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        }
      />

      {/* Speed Comparison */}
      <StatPageCard
        category="Fun Fact"
        title="Speed Animal"
        value={parseFloat(avgSpeed) >= 25 ? "🐆 Cheetah" : parseFloat(avgSpeed) >= 20 ? "🐎 Horse" : parseFloat(avgSpeed) >= 15 ? "🐕 Dog" : "🐢 Turtle"}
        description={`At ${avgSpeed} km/h, you ski like a ${parseFloat(avgSpeed) >= 20 ? 'speed demon' : 'steady cruiser'}!`}
        icon="🏃‍♂️"
        chart={
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={[
              { name: 'You', speed: parseFloat(avgSpeed), fill: '#8b5cf6' },
              { name: 'Cheetah', speed: 30, fill: '#64748b' },
              { name: 'Horse', speed: 20, fill: '#475569' }
            ]}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
              <YAxis stroke="rgba(255,255,255,0.5)" />
              <Tooltip 
                contentStyle={{ 
                  background: 'linear-gradient(to bottom right, rgba(39, 39, 39, 0.95) 20%, rgba(0, 0, 0, 0.9) 65%)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.07)',
                  borderRadius: '8px',
                  boxShadow: '0 6px 16px rgba(0, 0, 0, 0.25)'
                }}
                labelStyle={{ color: '#fff' }}
              />
              <Bar dataKey="speed" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        }
      />

      {/* Resort Explorer Badge */}
      <StatPageCard
        category="Fun Fact"
        title="Explorer Badge"
        value={uniqueResorts >= 20 ? "🌟 Globetrotter" : uniqueResorts >= 10 ? "🗺️ Adventurer" : uniqueResorts >= 5 ? "🧭 Explorer" : "🏠 Homebody"}
        description={`${uniqueResorts} resorts visited — ${uniqueResorts >= 10 ? "you love variety!" : "time to explore new slopes!"}`}
        icon="🎖️"
        chart={
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={[
                  { name: 'Visited', value: uniqueResorts, fill: '#10b981' },
                  { name: 'Many More', value: Math.max(5, 25 - uniqueResorts), fill: '#1f1f2e' }
                ]}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={70}
                paddingAngle={5}
                dataKey="value"
              >
                <Cell key="cell-0" fill="#10b981" />
                <Cell key="cell-1" fill="#1f1f2e" />
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  background: 'linear-gradient(to bottom right, rgba(39, 39, 39, 0.95) 20%, rgba(0, 0, 0, 0.9) 65%)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.07)',
                  borderRadius: '8px',
                  boxShadow: '0 6px 16px rgba(0, 0, 0, 0.25)'
                }}
                labelStyle={{ color: '#fff' }}
              />
            </PieChart>
          </ResponsiveContainer>
        }
      />

        </div>
      </div>
      )}

    </div>
  );
}
