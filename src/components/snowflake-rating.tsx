"use client";

import { Snowflake } from "lucide-react";
import { useState } from "react";

type SnowflakeRatingProps = {
  value: number;
  onChange: (value: number) => void;
  max?: number;
};

export function SnowflakeRating({
  value,
  onChange,
  max = 5,
}: SnowflakeRatingProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const displayValue = hoverValue !== null ? hoverValue : value;

  function handleClick(index: number, isLeftHalf: boolean) {
    const newValue = index + (isLeftHalf ? 0.5 : 1);
    onChange(newValue);
  }

  function handleMouseMove(index: number, e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const isLeftHalf = x < rect.width / 2;
    setHoverValue(index + (isLeftHalf ? 0.5 : 1));
  }

  return (
    <div
      className="flex gap-1.5 snowflake-rating-container"
      onMouseLeave={() => setHoverValue(null)}
    >
      {Array.from({ length: max }, (_, i) => {
        const isFilled = displayValue >= i + 1;
        const isHalfFilled = displayValue >= i + 0.5 && displayValue < i + 1;

        return (
          <div
            key={i}
            className="relative cursor-pointer"
            onMouseMove={(e) => handleMouseMove(i, e)}
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const isLeftHalf = x < rect.width / 2;
              handleClick(i, isLeftHalf);
            }}
          >
            {/* Background snowflake (empty) */}
            <Snowflake
              className="w-16 h-16 text-slate-700 snowflake-icon"
              fill="transparent"
              strokeWidth={1.5}
            />

            {/* Filled snowflake overlay */}
            {(isFilled || isHalfFilled) && (
              <div
                className="absolute inset-0 overflow-hidden"
                style={{
                  width: isHalfFilled ? "50%" : "100%",
                }}
              >
                <Snowflake
                  className="w-16 h-16 text-sky-400 snowflake-icon"
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
