"use client";

import { Snowflake } from "lucide-react";

type SnowflakeRatingDisplayProps = {
  value: number;
  max?: number;
  size?: number;
};

export function SnowflakeRatingDisplay({
  value,
  max = 5,
  size = 16,
}: SnowflakeRatingDisplayProps) {
  return (
    <div className="flex gap-1.5" title={`Average Rating: ${value.toFixed(2)} ⭐`}>
      {Array.from({ length: max }, (_, i) => {
        const fillPercentage = Math.min(Math.max((value - i) * 100, 0), 100);
        
        return (
          <div
            key={i}
            className="relative"
            style={{ width: size * 4, height: size * 4 }}
          >
            {/* Background snowflake (empty) */}
            <Snowflake
              className="text-slate-700"
              style={{ width: size * 4, height: size * 4 }}
              fill="transparent"
              strokeWidth={1.5}
            />

            {/* Filled snowflake overlay */}
            {fillPercentage > 0 && (
              <div
                className="absolute inset-0 overflow-hidden"
                style={{
                  width: `${fillPercentage}%`,
                }}
              >
                <Snowflake
                  className="text-sky-400"
                  style={{ width: size * 4, height: size * 4 }}
                  fill="currentColor"
                  strokeWidth={1.5}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
