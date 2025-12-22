"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Info, X, MousePointer } from "lucide-react";

const SKI_TYPES_INFO = [
  {
    id: "piste",
    label: "Piste",
    color: "#22c55e",
    description: "Groomed slopes",
  },
  {
    id: "park",
    label: "Park",
    color: "#ef4444",
    description: "Terrain parks & jumps",
  },
  {
    id: "freeride",
    label: "Freeride",
    color: "#f97316",
    description: "Off-piste skiing",
  },
  {
    id: "touring",
    label: "Touring",
    color: "#a855f7",
    description: "Touring & skinning",
  },
  {
    id: "street",
    label: "Street",
    color: "#06b6d4",
    description: "Urban skiing",
  },
];

export function SkiTypeInfo() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="ski-info-trigger"
        aria-label="Calendar info"
      >
        <Info className="w-4 h-4" />
      </button>

      {mounted &&
        isOpen &&
        createPortal(
          <div className="ski-info-overlay" onClick={() => setIsOpen(false)}>
            <div
              className="ski-info-dialog"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="ski-info-header">
                <h3 className="ski-info-title">How to use</h3>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="ski-info-close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="ski-info-content">
                <div className="ski-info-section">
                  <div className="ski-info-section-header">
                    <MousePointer className="w-4 h-4 text-sky-400" />
                    <span>Viewing & Editing</span>
                  </div>
                  <p className="ski-info-description">
                    Click on any ski day to view details, edit, or delete it.
                  </p>
                </div>

                <div className="ski-info-section">
                  <div className="ski-info-section-header">
                    <span>Ski Type Colors</span>
                  </div>
                  <p className="ski-info-description">
                    The colored line under each day shows the type of skiing:
                  </p>
                  <ul className="ski-info-list">
                    {SKI_TYPES_INFO.map((type) => (
                      <li key={type.id} className="ski-info-item">
                        <span
                          className="ski-info-color"
                          style={{ backgroundColor: type.color }}
                        />
                        <div className="ski-info-text">
                          <span className="ski-info-label">{type.label}</span>
                          <span className="ski-info-desc">
                            {type.description}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <p className="ski-info-note">
                    Multiple colors = multiple ski types that day.
                  </p>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
