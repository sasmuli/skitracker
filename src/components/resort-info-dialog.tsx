"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, MapPin, Mountain, Cable, Ruler } from "lucide-react";
import type { Resort } from "@/types";

interface ResortInfoDialogProps {
  resort: Resort | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ResortInfoDialog({ resort, isOpen, onClose }: ResortInfoDialogProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!resort) return null;

  return (
    <>
      {mounted &&
        isOpen &&
        createPortal(
          <div className="ski-info-overlay" onClick={onClose}>
            <div
              className="ski-info-dialog"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="ski-info-header">
                <h3 className="ski-info-title">{resort.name}</h3>
                <button
                  type="button"
                  onClick={onClose}
                  className="ski-info-close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="ski-info-content">
                <div className="ski-info-section">
                  <div className="ski-info-section-header">
                    <MapPin className="w-4 h-4 text-sky-400" />
                    <span>Location</span>
                  </div>
                  <p className="ski-info-description">
                    {resort.location_city && resort.location_country
                      ? `${resort.location_city}, ${resort.location_country}`
                      : resort.location_country || "Not specified"}
                    {resort.location_area && (
                      <span className="block text-sm text-[var(--color-text-muted)] mt-1">
                        {resort.location_area}
                      </span>
                    )}
                  </p>
                </div>

                {resort.height_m && (
                  <div className="ski-info-section">
                    <div className="ski-info-section-header">
                      <Mountain className="w-4 h-4 text-sky-400" />
                      <span>Height</span>
                    </div>
                    <p className="ski-info-description">{resort.height_m}m</p>
                  </div>
                )}

                {resort.lifts && (
                  <div className="ski-info-section">
                    <div className="ski-info-section-header">
                      <Cable className="w-4 h-4 text-sky-400" />
                      <span>Lifts</span>
                    </div>
                    <p className="ski-info-description">{resort.lifts} lifts</p>
                  </div>
                )}

                {resort.skislopes_km && (
                  <div className="ski-info-section">
                    <div className="ski-info-section-header">
                      <Ruler className="w-4 h-4 text-sky-400" />
                      <span>Ski Slopes</span>
                    </div>
                    <p className="ski-info-description">{resort.skislopes_km}km of slopes</p>
                  </div>
                )}
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}