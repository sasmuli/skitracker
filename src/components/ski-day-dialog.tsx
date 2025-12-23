"use client";

import { useState, useEffect } from "react";
import {
  X,
  MapPin,
  Clock,
  Snowflake,
  FileText,
  Trash2,
  Route,
  Pencil,
  Save,
} from "lucide-react";
import type { SkiDay, ResortOption, UpdateSkiDayInput } from "@/types";
import { SKI_TYPES } from "@/types";
import { CustomSelect } from "./custom-select";
import { SnowflakeRating } from "./snowflake-rating";

type SkiDayDialogProps = {
  skiDay: SkiDay | null;
  resorts: ResortOption[];
  onClose: () => void;
  onDelete?: (id: string) => Promise<void>;
  onEdit?: (input: UpdateSkiDayInput) => Promise<void>;
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

export function SkiDayDialog({
  skiDay,
  resorts,
  onClose,
  onDelete,
  onEdit,
}: SkiDayDialogProps) {
  const [deleting, setDeleting] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form state for editing
  const [resortId, setResortId] = useState("");
  const [hours, setHours] = useState("");
  const [distanceKm, setDistanceKm] = useState("");
  const [rating, setRating] = useState(0);
  const [notes, setNotes] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  // Reset states when a different ski day is selected
  useEffect(() => {
    setDeleting(false);
    setDeleted(false);
    setConfirmDelete(false);
    setEditMode(false);
    setSaving(false);

    // Initialize form with current values
    if (skiDay) {
      setResortId(skiDay.resort?.id || "");
      setHours(skiDay.hours?.toString() || "");
      setDistanceKm(skiDay.distance_km?.toString() || "");
      setRating(skiDay.rating || 0);
      setNotes(skiDay.notes || "");
      setSelectedTypes(skiDay.ski_types || []);
    }
  }, [skiDay?.id]);

  if (!skiDay) return null;

  function toggleSkiType(typeId: string) {
    setSelectedTypes((prev) =>
      prev.includes(typeId)
        ? prev.filter((t) => t !== typeId)
        : [...prev, typeId]
    );
  }

  async function handleSave() {
    if (!skiDay || !onEdit) return;

    setSaving(true);
    await onEdit({
      id: skiDay.id,
      resort_id: resortId || undefined,
      hours: hours ? parseFloat(hours) : null,
      distance_km: distanceKm ? parseFloat(distanceKm) : null,
      rating: rating || null,
      notes: notes || null,
      ski_types: selectedTypes,
    });
    setSaving(false);
  }

  async function handleDelete() {
    if (!skiDay) return;

    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }

    if (onDelete) {
      setDeleting(true);
      await onDelete(skiDay.id);
      setDeleting(false);
      setDeleted(true);
    }
  }

  const resortOptions = resorts.map((r) => ({ value: r.id, label: r.name }));

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
          {editMode ? (
            <>
              {/* Edit Mode */}
              <div className="form-group">
                <label className="form-label">Resort</label>
                <CustomSelect
                  options={resortOptions}
                  value={resortId}
                  onChange={setResortId}
                  placeholder="Select resort..."
                />
              </div>

              <div className="form-group">
                <label className="form-label">Hours</label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  className="input"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  placeholder="e.g. 4"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Distance (km)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  className="input"
                  value={distanceKm}
                  onChange={(e) => setDistanceKm(e.target.value)}
                  placeholder="e.g. 25"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Rating</label>
                <SnowflakeRating value={rating} onChange={setRating} />
              </div>

              <div className="form-group">
                <label className="form-label">What did you ski?</label>
                <div className="flex flex-wrap gap-2">
                  {SKI_TYPES.map((type) => {
                    const active = selectedTypes.includes(type.id);
                    return (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => toggleSkiType(type.id)}
                        className={`chip ${active ? "chip-active" : ""}`}
                      >
                        {type.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Notes</label>
                <textarea
                  className="input"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add notes..."
                />
              </div>
            </>
          ) : (
            <>
              {/* View Mode */}
              {/* Resort */}
              {skiDay.resort && (
                <div className="ski-day-dialog-row">
                  <MapPin className="w-5 h-5 text-sky-400" />
                  <span className="ski-day-dialog-label">Resort</span>
                  <span className="ski-day-dialog-value">
                    {skiDay.resort.name}
                  </span>
                </div>
              )}

              {/* Hours */}
              {skiDay.hours !== null && (
                <div className="ski-day-dialog-row">
                  <Clock className="w-5 h-5 text-sky-400" />
                  <span className="ski-day-dialog-label">Hours</span>
                  <span className="ski-day-dialog-value">
                    {skiDay.hours} hours
                  </span>
                </div>
              )}

              {/* Distance */}
              {skiDay.distance_km !== null && (
                <div className="ski-day-dialog-row">
                  <Route className="w-5 h-5 text-sky-400" />
                  <span className="ski-day-dialog-label">Distance</span>
                  <span className="ski-day-dialog-value">
                    {skiDay.distance_km} km
                  </span>
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
                        fill={
                          i < skiDay.rating! ? "currentColor" : "transparent"
                        }
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
            </>
          )}

          {/* Actions */}
          <div className="ski-day-dialog-actions">
            {editMode ? (
              <>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="btn btn-primary w-full"
                >
                  <Save className="w-4 h-4" />
                  {saving ? "Saving..." : "Save"}
                </button>
                <button
                  type="button"
                  onClick={() => setEditMode(false)}
                  className="btn btn-secondary w-full"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                {onEdit && (
                  <button
                    type="button"
                    onClick={() => setEditMode(true)}
                    className="btn btn-primary w-full"
                  >
                    <Pencil className="w-4 h-4" />
                    Edit
                  </button>
                )}
                {onDelete && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={deleting || deleted}
                    className={`btn ${
                      deleted
                        ? "btn-primary"
                        : confirmDelete
                        ? "btn-danger"
                        : "btn-secondary"
                    } w-full`}
                  >
                    <Trash2 className="w-4 h-4" />
                    {deleted
                      ? "Deleted!"
                      : deleting
                      ? "Deleting..."
                      : confirmDelete
                      ? "Confirm delete"
                      : "Delete"}
                  </button>
                )}
                {confirmDelete && !deleted && (
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(false)}
                    className="btn btn-secondary w-full"
                  >
                    Cancel
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
