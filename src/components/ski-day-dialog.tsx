"use client";

import { X, MapPin, Clock, Snowflake, FileText } from "lucide-react";
import type { SkiDay } from "@/types";
import { SKI_TYPES } from "@/types";

type SkiDayDialogProps = {
  skiDay: SkiDay | null;
  onClose: () => void;
};

// Color mapping for ski types
const SKI_TYPE_COLORS: Record<string, string> = {
  piste: "#22c55e",
  park: "#ef4444",
  freeride: "#f97316",
  touring: "#a855f7",
  street: "#06b6d4",
};

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getSkiTypeLabel(typeId: string): string {
  const skiType = SKI_TYPES.find((t) => t.id === typeId);
  return skiType?.label || typeId;
}

export function SkiDayDialog({ skiDay, onClose }: SkiDayDialogProps) {
  if (!skiDay) return null;

  return (
    <div className="ski-day-dialog-overlay" onClick={onClose}>
      <div className="ski-day-dialog" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="ski-day-dialog-header">
          <h2 className="ski-day-dialog-title">{formatDate(skiDay.date)}</h2>
          <button
            type="button"
            onClick={onClose}
            className="ski-day-dialog-close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="ski-day-dialog-content">
          {/* Resort */}
          {skiDay.resort && (
            <div className="ski-day-dialog-row">
              <MapPin className="w-5 h-5 text-sky-400" />
              <span className="ski-day-dialog-label">Resort</span>
              <span className="ski-day-dialog-value">{skiDay.resort.name}</span>
            </div>
          )}

          {/* Hours */}
          {skiDay.hours !== null && (
            <div className="ski-day-dialog-row">
              <Clock className="w-5 h-5 text-sky-400" />
              <span className="ski-day-dialog-label">Hours</span>
              <span className="ski-day-dialog-value">{skiDay.hours} hours</span>
            </div>
          )}

          {/* Rating */}
          {skiDay.rating !== null && (
            <div className="ski-day-dialog-row">
              <Snowflake className="w-5 h-5 text-sky-400" />
              <span className="ski-day-dialog-label">Rating</span>
              <span className="ski-day-dialog-value ski-day-dialog-rating">
                {Array.from({ length: 5 }, (_, i) => (
                  <Snowflake
                    key={i}
                    className={`w-5 h-5 ${
                      i < skiDay.rating! ? "text-sky-400" : "text-slate-700"
                    }`}
                    fill={i < skiDay.rating! ? "currentColor" : "transparent"}
                  />
                ))}
              </span>
            </div>
          )}

          {/* Ski Types */}
          {skiDay.ski_types && skiDay.ski_types.length > 0 && (
            <div className="ski-day-dialog-section">
              <span className="ski-day-dialog-section-title">
                What you skied
              </span>
              <div className="ski-day-dialog-chips">
                {skiDay.ski_types.map((typeId) => (
                  <span
                    key={typeId}
                    className="ski-day-dialog-chip"
                    style={{
                      backgroundColor: `${SKI_TYPE_COLORS[typeId]}20`,
                      borderColor: SKI_TYPE_COLORS[typeId],
                      color: SKI_TYPE_COLORS[typeId],
                    }}
                  >
                    {getSkiTypeLabel(typeId)}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {skiDay.notes && (
            <div className="ski-day-dialog-section">
              <span className="ski-day-dialog-section-title">
                <FileText className="w-4 h-4 inline mr-1" />
                Notes
              </span>
              <p className="ski-day-dialog-notes">{skiDay.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
