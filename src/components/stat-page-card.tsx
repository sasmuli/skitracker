"use client";

import React from 'react';

export interface StatPageCardProps {
  category: string;
  title: string;
  value?: string | number;
  description: string;
  icon?: string;
  chart?: React.ReactNode;
}

export function StatPageCard({
  category,
  title,
  value,
  description,
  icon,
  chart
}: StatPageCardProps) {
  return (
    <div className="glass-card !min-h-[320px] flex flex-col justify-between">
      {/* Category Label */}
      <div className="flex justify-between items-start mb-4">
        <span className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider">
          {category}
        </span>
        {icon && <span className="text-2xl">{icon}</span>}
      </div>

      {/* Main Content */}
      {!chart || value ? (
        <div className="flex-1 flex flex-col justify-center">
          <h3 className="text-5xl font-bold text-[var(--foreground)] mb-3 leading-tight">
            {value}
          </h3>
          <p className="text-xl font-semibold text-[var(--foreground)] mb-2">
            {title}
          </p>
          <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
            {description}
          </p>
        </div>
      ) : (
        <div>
          <p className="text-lg font-semibold text-[var(--foreground)] mb-2">
            {title}
          </p>
        </div>
      )}

      {/* Optional Chart */}
      {chart && (
        <div className={!value ? "flex-1 min-h-[350px]" : "mt-6 pt-4 border-t border-[rgba(255,255,255,0.07)]"}>
          <div className={!value ? "h-full w-full" : "h-[180px] w-full"}>
            {chart}
          </div>
        </div>
      )}
    </div>
  );
}