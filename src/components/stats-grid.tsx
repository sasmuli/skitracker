"use client";

import { StatPageCard } from "@/components/stat-page-card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, RadialBarChart, RadialBar, Legend, LineChart, Line, ReferenceLine } from 'recharts';
import type { SkiDay, Resort } from "@/types";
import { Info, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

export type FilterCategory = 'all' | 'distance' | 'endurance' | 'resort' | 'quality' | 'types' | 'fun';

interface StatsGridProps {
  skiDays: SkiDay[];
  allResorts: Resort[];
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

export function StatsGrid({
  skiDays,
  allResorts,
  totalDistance,
  totalHours,
  totalDays,
  avgRating,
  uniqueResorts,
  earthPercent,
  finlandTimes,
  helsinkiRovaniemiTimes,
  marathons,
  avgSpeed,
  avgDayLength,
  workdays,
  nonStopDays,
  avgDistancePerResort,
  avgHoursPerResort,
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
}: StatsGridProps) {
  const [showUnvisitedDialog, setShowUnvisitedDialog] = useState(false);
  const [showAdventureRatioDialog, setShowAdventureRatioDialog] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Get visited resorts
  const visitedResortNames = new Set(skiDays.map(d => d.resort?.name).filter(Boolean));
  const unvisitedResorts = allResorts.filter((r: Resort) => !visitedResortNames.has(r.name));
  
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
    { name: 'To Explore', value: Math.max(0, allResorts.length - uniqueResorts), fill: '#1f1f2e' }
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
    <>
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
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full transition-all duration-500"
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
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full transition-all duration-500"
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
                itemStyle={{ color: '#fff' }}
                formatter={(value, name) => [`${Number(value).toFixed(1)} Km`, name]}
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
            <LineChart
              data={(() => {
                const sortedDays = [...skiDays].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
                const intervals = [];
                
                intervals.push({
                  day: '0',
                  speed: 0,
                  date: sortedDays[0]?.date || ''
                });
                
                for (let i = 5; i <= sortedDays.length; i += 5) {
                  const daysToInclude = sortedDays.slice(0, i);
                  const totalSpeed = daysToInclude.reduce((sum, d) => {
                    const speed = (d.distance_km || 0) / (d.hours || 1);
                    return sum + speed;
                  }, 0);
                  const avgSpeed = daysToInclude.length > 0 ? totalSpeed / daysToInclude.length : 0;
                  
                  intervals.push({
                    day: `${i}`,
                    speed: Number(avgSpeed.toFixed(1)),
                    date: sortedDays[i - 1]?.date || ''
                  });
                }
                
                return intervals;
              })()}
              margin={{ top: 10, right: 20, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis
                dataKey="day"
                stroke="#94a3b8"
                style={{ fontSize: '11px' }}
              />
              <YAxis
                stroke="#94a3b8"
                style={{ fontSize: '11px' }}
              />
              <Tooltip
                contentStyle={{
                  background: "linear-gradient(to bottom right, rgba(39, 39, 39, 0.75) 20%, rgba(0, 0, 0, 0.6) 65%)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  border: "1px solid rgba(255, 255, 255, 0.07)",
                  borderRadius: "8px",
                  color: "#f1f5f9",
                  fontSize: "12px",
                  boxShadow: "0 6px 16px rgba(0, 0, 0, 0.25)"
                }}
                labelStyle={{ color: '#ffffff' }}
                formatter={(value) => [`${Number(value).toFixed(1)} km/h`, 'Avg Speed']}
              />
              <ReferenceLine 
                y={15} 
                stroke="#6366f1" 
                strokeDasharray="3 3" 
                strokeWidth={2}
                label={{ value: 'Avg Skier (15 km/h)', position: 'insideTopRight', fill: '#6366f1', fontSize: 10 }}
              />
              <Line 
                type="monotone" 
                dataKey="speed" 
                stroke="#8b5cf6" 
                strokeWidth={2}
                dot={{ fill: '#8b5cf6', r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
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
            <LineChart
              data={(() => {
                const sortedDays = [...skiDays].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
                const intervals = [];
                
                intervals.push({
                  day: '0',
                  hours: 0,
                  date: sortedDays[0]?.date || ''
                });
                
                for (let i = 5; i <= sortedDays.length; i += 5) {
                  const daysToInclude = sortedDays.slice(0, i);
                  const totalHours = daysToInclude.reduce((sum, d) => sum + (d.hours || 0), 0);
                  const avgHours = daysToInclude.length > 0 ? totalHours / daysToInclude.length : 0;
                  
                  intervals.push({
                    day: `${i}`,
                    hours: Number(avgHours.toFixed(1)),
                    date: sortedDays[i - 1]?.date || ''
                  });
                }
                
                return intervals;
              })()}
              margin={{ top: 10, right: 20, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis
                dataKey="day"
                stroke="#94a3b8"
                style={{ fontSize: '11px' }}
              />
              <YAxis
                stroke="#94a3b8"
                style={{ fontSize: '11px' }}
              />
              <Tooltip
                contentStyle={{
                  background: 'linear-gradient(to bottom right, rgba(39, 39, 39, 0.75) 20%, rgba(0, 0, 0, 0.6) 65%)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.07)',
                  borderRadius: '8px',
                  color: '#f1f5f9',
                  fontSize: '12px',
                  boxShadow: '0 6px 16px rgba(0, 0, 0, 0.25)'
                }}
                labelStyle={{ color: '#ffffff' }}
                formatter={(value) => [`${Number(value).toFixed(1)} hours`, 'Avg Length']}
              />
              <Line
                type="monotone"
                dataKey="hours"
                stroke="#0ea5e9"
                strokeWidth={2}
                dot={{ fill: '#0ea5e9', r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
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
          <div className="flex flex-col justify-center h-full px-4">
            <div className="mb-2">
              <div className="flex justify-between items-center mb-2">
                <p className="text-xs text-[rgba(255,255,255,0.5)]">Progress to next workday</p>
                <p className="text-sm font-semibold text-blue-400">
                  {((totalHours % 8) / 8 * 100).toFixed(0)}%
                </p>
              </div>
              <div className="relative h-3 bg-[rgba(255,255,255,0.05)] rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
                  style={{ width: `${(totalHours % 8) / 8 * 100}%` }}
                />
              </div>
              <p className="text-xs text-[rgba(255,255,255,0.4)] mt-1 text-right">
                {(totalHours % 8).toFixed(1)}h of 8h
              </p>
            </div>
          </div>
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
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="60%"
              outerRadius="90%"
              data={[{
                name: 'Days',
                value: (parseFloat(nonStopDays) / 30) * 100,
                fill: '#f59e0b'
              }]}
              startAngle={90}
              endAngle={-270}
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
                formatter={() => [`${nonStopDays} days`, 'Non-Stop']}
              />
              <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="fill-white text-2xl font-bold">
                {nonStopDays}
              </text>
              <text x="50%" y="60%" textAnchor="middle" dominantBaseline="middle" className="fill-gray-400 text-xs">
                days
              </text>
            </RadialBarChart>
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
      <div className="relative">
        <button
          type="button"
          onClick={() => setShowUnvisitedDialog(true)}
          className="ski-info-trigger absolute top-6 right-16 z-10"
          aria-label="View unvisited resorts"
        >
          <Info className="w-4 h-4" />
        </button>
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
                itemStyle={{ color: '#fff' }}
                formatter={(value, name) => {
                  const total = resortData.reduce((sum, item) => sum + item.value, 0);
                  const percentage = ((Number(value) / total) * 100).toFixed(1);
                  return [`${value} (${percentage}%)`, name];
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        }
      />
      </div>

      {/* Resort Efficiency */}
      <StatPageCard
        category="Efficiency"
        title="Distance Per Resort"
        value={`${avgDistancePerResort} km`}
        description={`You average ${avgDistancePerResort} km at each resort`}
        icon="📊"
        chart={
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={(() => {
                const sortedDays = [...skiDays].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
                const intervals = [];
                
                intervals.push({
                  day: '0',
                  resorts: 0,
                  avgDistance: 0
                });
                
                for (let i = 5; i <= sortedDays.length; i += 5) {
                  const daysToInclude = sortedDays.slice(0, i);
                  const uniqueResortSet = new Set(daysToInclude.map(d => d.resort?.name).filter(Boolean));
                  const totalDistance = daysToInclude.reduce((sum, d) => sum + (d.distance_km || 0), 0);
                  const avgKmPerResort = uniqueResortSet.size > 0 ? totalDistance / uniqueResortSet.size : 0;
                  
                  intervals.push({
                    day: `${i}`,
                    resorts: uniqueResortSet.size,
                    avgDistance: Number(avgKmPerResort.toFixed(1))
                  });
                }
                
                return intervals;
              })()}
              margin={{ top: 10, right: 20, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis
                dataKey="day"
                stroke="#94a3b8"
                style={{ fontSize: '11px' }}
              />
              <YAxis
                stroke="#94a3b8"
                style={{ fontSize: '11px' }}
              />
              <Tooltip
                contentStyle={{
                  background: 'linear-gradient(to bottom right, rgba(39, 39, 39, 0.75) 20%, rgba(0, 0, 0, 0.6) 65%)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.07)',
                  borderRadius: '8px',
                  color: '#f1f5f9',
                  fontSize: '12px',
                  boxShadow: '0 6px 16px rgba(0, 0, 0, 0.25)'
                }}
                labelStyle={{ color: '#ffffff' }}
              />
              <Line
                type="monotone"
                dataKey="resorts"
                stroke="#ef4444"
                strokeWidth={2}
                dot={{ fill: '#ef4444', r: 3 }}
                activeDot={{ r: 5 }}
                name="Resorts Visited"
              />
              <Line
                type="monotone"
                dataKey="avgDistance"
                stroke="#a855f7"
                strokeWidth={2}
                dot={{ fill: '#a855f7', r: 3 }}
                activeDot={{ r: 5 }}
                name="Avg Distance (km)"
              />
            </LineChart>
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
            <LineChart
              data={(() => {
                const sortedDays = [...skiDays].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
                const discoveryData = [];
                const seenResorts = new Set();
                
                discoveryData.push({
                  day: 0,
                  resorts: 0
                });

                sortedDays.forEach((day, index) => {
                  if (day.resort?.name && !seenResorts.has(day.resort.name)) {
                    seenResorts.add(day.resort.name);
                    discoveryData.push({
                      day: index + 1,
                      resorts: seenResorts.size
                    });
                  }
                });

                return discoveryData;
              })()}
              margin={{ top: 10, right: 20, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis
                dataKey="day"
                stroke="#94a3b8"
                style={{ fontSize: '11px' }}
                label={{ value: 'Ski Days', position: 'insideBottom', offset: -5, fill: '#94a3b8', fontSize: 11 }}
              />
              <YAxis
                stroke="#94a3b8"
                style={{ fontSize: '11px' }}
                label={{ value: 'Resorts', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 11 }}
              />
              <Tooltip
                contentStyle={{
                  background: 'linear-gradient(to bottom right, rgba(39, 39, 39, 0.75) 20%, rgba(0, 0, 0, 0.6) 65%)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.07)',
                  borderRadius: '8px',
                  color: '#f1f5f9',
                  fontSize: '12px',
                  boxShadow: '0 6px 16px rgba(0, 0, 0, 0.25)'
                }}
                labelStyle={{ color: '#ffffff' }}
                labelFormatter={(value) => `Day: ${value}`}
                formatter={(value) => [`${value} resorts`, 'Discovered']}
              />
              <Line
                type="stepAfter"
                dataKey="resorts"
                stroke="#14b8a6"
                strokeWidth={2}
                dot={{ fill: '#14b8a6', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        }
      />

      {/* Favorite Resort Share */}
      <StatPageCard
        category="Exploration"
        title="All Resorts Visited"
        value={`${uniqueResorts}`}
        description={`${favoriteResortName} is your favorite with ${favoriteResortShare}% of days`}
        icon="❤️"
        chart={
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={(() => {
                const resortCounts: Record<string, number> = {};
                skiDays.forEach(day => {
                  if (day.resort?.name) {
                    resortCounts[day.resort.name] = (resortCounts[day.resort.name] || 0) + 1;
                  }
                });
                return Object.entries(resortCounts)
                  .map(([name, count]) => ({ name, days: count }))
                  .sort((a, b) => b.days - a.days);
              })()}
              layout="vertical"
              margin={{ left: 0, right: 10, top: 5, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis type="number" stroke="rgba(255,255,255,0.5)" />
              <YAxis 
                type="category" 
                dataKey="name" 
                stroke="rgba(255,255,255,0.5)" 
                width={80}
                tick={{ fontSize: 11 }}
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
                cursor={{fill: 'transparent'}}
                labelStyle={{ color: '#fff' }}
                formatter={(value: number | undefined) => [`${value || 0} days`, 'Visits']}
              />
              <Bar dataKey="days" fill="#0ea5e9" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        }
      />

      {/* Adventure Ratio */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setShowAdventureRatioDialog(true)}
          className="ski-info-trigger absolute top-6 right-16 z-10"
          aria-label="Learn about Adventure Ratio"
        >
          <Info className="w-4 h-4" />
        </button>
      <StatPageCard
        category="Exploration"
        title="Adventure Ratio"
        value={adventureRatio}
        description={`${adventureRatio} resorts per ski day - higher means you explore new places often`}
        icon="🧭"
        chart={
          <div className="flex flex-col justify-center h-full px-4">
            <div className="text-center mb-4">
              <div className="text-5xl font-bold text-purple-400 mb-2">{adventureRatio}</div>
              <div className="text-sm text-gray-400">
                {parseFloat(adventureRatio) >= 0.8 
                  ? '🌟 Explorer!' 
                  : parseFloat(adventureRatio) >= 0.4
                  ? '⚖️ Adventurous'
                  : parseFloat(adventureRatio) >= 0.2
                  ? '🏔️ Balanced'
                  : '🎿 Home Mountain'}
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-400">
                <span>Exploration Level</span>
                <span>{Math.min(Math.round(parseFloat(adventureRatio) * 100), 100)}%</span>
              </div>
              <div className="relative h-4 bg-[rgba(255,255,255,0.05)] rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(parseFloat(adventureRatio) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>
        }
      />
      </div>

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

    {mounted && showUnvisitedDialog && createPortal(
      <div className="ski-info-overlay" onClick={() => setShowUnvisitedDialog(false)}>
        <div className="ski-info-dialog" onClick={(e) => e.stopPropagation()}>
          <div className="ski-info-header">
            <h3 className="ski-info-title">Resorts to Explore</h3>
            <button
              type="button"
              onClick={() => setShowUnvisitedDialog(false)}
              className="ski-info-close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="ski-info-content">
            {unvisitedResorts.length > 0 ? (
              <ul className="space-y-3">
                {unvisitedResorts.map((resort: Resort) => (
                  <li key={resort.id} className="border-b border-white/10 pb-3 last:border-0">
                    <div className="font-medium text-white">{resort.name}</div>
                    {(resort.location_city || resort.location_country) && (
                      <div className="text-sm text-gray-400 mt-1">
                        {[resort.location_city, resort.location_country].filter(Boolean).join(', ')}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-400">You've visited all resorts in the database! 🎉</p>
            )}
          </div>
        </div>
      </div>,
      document.body
    )}

    {mounted && showAdventureRatioDialog && createPortal(
      <div className="ski-info-overlay" onClick={() => setShowAdventureRatioDialog(false)}>
        <div className="ski-info-dialog" onClick={(e) => e.stopPropagation()}>
          <div className="ski-info-header">
            <h3 className="ski-info-title">Adventure Ratio Explained</h3>
            <button
              type="button"
              onClick={() => setShowAdventureRatioDialog(false)}
              className="ski-info-close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="ski-info-content">
            <div className="space-y-4 text-sm">
              <div>
                <h4 className="font-semibold text-white mb-2">What is Adventure Ratio?</h4>
                <p className="text-gray-300">
                  Adventure Ratio measures how often you explore new resorts. The scale is capped at 1.0 (maximum exploration), 
                  which represents discovering a new resort every 10 ski days or less.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-2">How to interpret it:</h4>
                <ul className="space-y-2 text-gray-300">
                  <li><span className="text-purple-400 font-semibold">1.0</span> - New resort every 10 days or less (maximum!)</li>
                  <li><span className="text-purple-400 font-semibold">0.5</span> - New resort every 20 ski days</li>
                  <li><span className="text-purple-400 font-semibold">0.3</span> - New resort every ~33 ski days</li>
                  <li><span className="text-purple-400 font-semibold">0.2</span> - New resort every 50 ski days</li>
                  <li><span className="text-purple-400 font-semibold">0.1</span> - New resort every 100 ski days</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-2">Your Status:</h4>
                <p className="text-gray-300">
                  {parseFloat(adventureRatio) >= 0.8 
                    ? "🌟 Explorer! You love discovering new mountains every few ski days."
                    : parseFloat(adventureRatio) >= 0.4
                    ? "⚖️ Adventurous - You regularly seek out new resorts to explore."
                    : parseFloat(adventureRatio) >= 0.2
                    ? "🏔️ Balanced - You enjoy both exploring and returning to favorite spots."
                    : "🎿 Home Mountain Devotee - You know your favorite resorts like the back of your hand!"
                  }
                </p>
              </div>

              <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                <p className="text-xs text-gray-400">
                  <strong>Your ratio:</strong> {adventureRatio} ({uniqueResorts} resorts ÷ {totalDays} ski days)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>,
      document.body
    )}
    </>
  );
}
