// src/app/app/add-day/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase/browser-client';
import { SnowflakeRating } from '@/components/snowflake-raiting';
import { MultiDatePicker } from '@/components/multi-date-picker';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type Resort = {
  id: string;
  name: string;
};

type SkiType = 'piste' | 'park' | 'freeride' | 'touring' | 'street';

type DayFormData = {
  resortId: string;
  hours: string;
  distanceKm: string;
  rating: number;
  notes: string;
  selectedTypes: SkiType[];
};

const SKI_TYPES: { id: SkiType; label: string }[] = [
  { id: 'piste', label: 'Piste' },
  { id: 'park', label: 'Park' },
  { id: 'freeride', label: 'Freeride' },
  { id: 'touring', label: 'Touring' },
  { id: 'street', label: 'Street' },
];

const TODAY = new Date().toISOString().slice(0, 10);

const EMPTY_FORM: DayFormData = {
  resortId: '',
  hours: '',
  distanceKm: '',
  rating: 0,
  notes: '',
  selectedTypes: [],
};

export default function AddSkiDayPage() {
  const supabase = createSupabaseBrowserClient();
  const router = useRouter();

  const [resorts, setResorts] = useState<Resort[]>([]);
  const [loadingResorts, setLoadingResorts] = useState(true);

  // Step: 'select-dates' or 'fill-forms'
  const [step, setStep] = useState<'select-dates' | 'fill-forms'>('select-dates');
  
  // Selected dates (sorted)
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  
  // Form data for each date (keyed by date string)
  const [formDataByDate, setFormDataByDate] = useState<Record<string, DayFormData>>({});
  
  // Current day index when filling forms
  const [currentDayIndex, setCurrentDayIndex] = useState(0);

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Load resorts from Supabase
  useEffect(() => {
    async function loadResorts() {
      setLoadingResorts(true);
      const { data, error } = await supabase
        .from('resorts')
        .select('id, name')
        .order('name', { ascending: true });

      if (!error && data) {
        setResorts(data);
      }
      setLoadingResorts(false);
    }

    loadResorts();
  }, [supabase]);

  // Initialize form data when dates change
  useEffect(() => {
    setFormDataByDate((prev) => {
      const newData: Record<string, DayFormData> = {};
      for (const date of selectedDates) {
        newData[date] = prev[date] || { ...EMPTY_FORM };
      }
      return newData;
    });
  }, [selectedDates]);

  // Current date and form data
  const currentDate = selectedDates[currentDayIndex];
  const currentFormData = formDataByDate[currentDate] || EMPTY_FORM;

  function updateCurrentFormData(updates: Partial<DayFormData>) {
    setFormDataByDate((prev) => ({
      ...prev,
      [currentDate]: { ...prev[currentDate], ...updates },
    }));
  }

  function toggleSkiType(type: SkiType) {
    const current = currentFormData.selectedTypes;
    const newTypes = current.includes(type)
      ? current.filter((t) => t !== type)
      : [...current, type];
    updateCurrentFormData({ selectedTypes: newTypes });
  }

  function handleStartFilling() {
    if (selectedDates.length === 0) {
      setErrorMsg('Please select at least one date.');
      return;
    }
    setErrorMsg(null);
    setCurrentDayIndex(0);
    setStep('fill-forms');
  }

  function handlePrevDay() {
    if (currentDayIndex > 0) {
      setCurrentDayIndex(currentDayIndex - 1);
    }
  }

  function handleNextDay() {
    // Validate current day before moving
    if (!currentFormData.resortId) {
      setErrorMsg('Please select a resort.');
      return;
    }
    setErrorMsg(null);
    
    if (currentDayIndex < selectedDates.length - 1) {
      setCurrentDayIndex(currentDayIndex + 1);
    }
  }

  async function handleSubmitAll() {
    // Validate current (last) day
    if (!currentFormData.resortId) {
      setErrorMsg('Please select a resort.');
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setErrorMsg('You must be logged in to add ski days.');
        setSubmitting(false);
        return;
      }

      // Prepare all records
      const records = selectedDates.map((date) => {
        const data = formDataByDate[date];
        return {
          user_id: user.id,
          date,
          resort_id: data.resortId,
          hours: data.hours ? Number(data.hours) : null,
          distance_km: data.distanceKm ? Number(data.distanceKm) : null,
          rating: data.rating || null,
          notes: data.notes || null,
          ski_types: data.selectedTypes.length > 0 ? data.selectedTypes : null,
        };
      });

      const { error } = await supabase.from('ski_days').insert(records);

      if (error) {
        setErrorMsg(error.message);
        setSubmitting(false);
        return;
      }

      // Success → go back to dashboard
      router.push('/app');
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  }

  function formatDateDisplay(dateStr: string) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }

  const isLastDay = currentDayIndex === selectedDates.length - 1;
  const isFirstDay = currentDayIndex === 0;

  // Step 1: Select dates
  if (step === 'select-dates') {
    return (
      <div className="p-6 flex justify-center">
        <div className="glass-card w-full max-w-xl space-y-5">
          <div>
            <h1 className="text-xl font-semibold">Add Ski Days</h1>
            <p className="text-xs text-slate-400">
              Select the dates you want to log, then fill in details for each day.
            </p>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-slate-400">Select dates</label>
            <MultiDatePicker
              selectedDates={selectedDates}
              onChange={setSelectedDates}
              maxDate={TODAY}
            />
          </div>

          {errorMsg && (
            <p className="text-xs text-red-400">{errorMsg}</p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => router.push('/app')}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleStartFilling}
              disabled={selectedDates.length === 0}
              className="btn btn-primary"
            >
              Continue ({selectedDates.length} day{selectedDates.length !== 1 ? 's' : ''})
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Fill forms for each day
  return (
    <div className="p-6 flex justify-center">
      <div className="glass-card w-full max-w-xl space-y-5">
        {/* Header with progress */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <h1 className="text-xl font-semibold">Add Ski Days</h1>
            <span className="text-xs text-slate-400">
              Day {currentDayIndex + 1} of {selectedDates.length}
            </span>
          </div>
          <p className="text-sm text-sky-400 font-medium">
            {formatDateDisplay(currentDate)}
          </p>
          
          {/* Progress dots */}
          <div className="flex gap-1.5 mt-3">
            {selectedDates.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  idx < currentDayIndex
                    ? 'bg-sky-500'
                    : idx === currentDayIndex
                    ? 'bg-sky-400'
                    : 'bg-slate-700'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Resort */}
        <div className="space-y-1">
          <label className="text-xs text-slate-400">Resort</label>
          <select
            className="input input-select"
            value={currentFormData.resortId}
            onChange={(e) => updateCurrentFormData({ resortId: e.target.value })}
            disabled={loadingResorts || resorts.length === 0}
          >
            {loadingResorts && (
              <option value="" disabled>
                Loading resorts…
              </option>
            )}
            {!loadingResorts && resorts.length === 0 && (
              <option value="" disabled>
                No resorts found. Add at least one resort.
              </option>
            )}
            {!loadingResorts &&
              resorts.length > 0 && [
                <option key="placeholder" value="" disabled>
                  Select resort
                </option>,
                ...resorts.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                )),
              ]}
          </select>
        </div>

        {/* Hours & distance */}
        <div className="flex flex-col gap-4 bp640:flex-row">
          <div className="flex-1 space-y-1">
            <label className="text-xs text-slate-400">Hours</label>
            <input
              type="number"
              min="0"
              step="0.5"
              className="input"
              value={currentFormData.hours}
              onChange={(e) => updateCurrentFormData({ hours: e.target.value })}
              placeholder="Select hours skied"
            />
          </div>

          <div className="flex-1 space-y-1">
            <label className="text-xs text-slate-400">Distance (km)</label>
            <input
              type="number"
              min="0"
              step="0.1"
              className="input"
              value={currentFormData.distanceKm}
              onChange={(e) => updateCurrentFormData({ distanceKm: e.target.value })}
              placeholder="Select distance"
            />
          </div>
        </div>

        {/* Rating */}
        <div className="space-y-2">
          <label className="text-xs text-slate-400">Rating (0–5)</label>
          <div className="flex justify-center">
            <SnowflakeRating
              value={currentFormData.rating}
              onChange={(rating) => updateCurrentFormData({ rating })}
            />
          </div>
        </div>

        {/* Ski types (multi-select) */}
        <div className="space-y-5">
          <label className="text-xs text-slate-400">
            What did you ski? (select one or more)
          </label>
          <div className="flex flex-wrap gap-2">
            {SKI_TYPES.map((type) => {
              const active = currentFormData.selectedTypes.includes(type.id);
              return (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => toggleSkiType(type.id)}
                  className={`text-m px-3 py-1 rounded-full border ${
                    active
                      ? 'bg-blue-600 border-blue-500 text-white'
                      : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {type.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-1">
          <label className="text-xs text-slate-400">Notes</label>
          <textarea
            rows={3}
            className="input resize-none"
            value={currentFormData.notes}
            onChange={(e) => updateCurrentFormData({ notes: e.target.value })}
            placeholder="Weather, snow conditions, tricks you learned…"
          />
        </div>

        {errorMsg && (
          <p className="text-xs text-red-400">{errorMsg}</p>
        )}

        {/* Navigation buttons */}
        <div className="flex justify-between gap-3 pt-2">
          <div className="flex gap-2">
            {!isFirstDay && (
              <button
                type="button"
                onClick={handlePrevDay}
                className="btn btn-secondary flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>
            )}
            {isFirstDay && (
              <button
                type="button"
                onClick={() => setStep('select-dates')}
                className="btn btn-secondary"
              >
                Back to dates
              </button>
            )}
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => router.push('/app')}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            
            {isLastDay ? (
              <button
                type="button"
                onClick={handleSubmitAll}
                disabled={submitting || loadingResorts || resorts.length === 0}
                className="btn btn-primary"
              >
                {submitting ? 'Saving…' : `Save ${selectedDates.length} ski day${selectedDates.length > 1 ? 's' : ''}`}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNextDay}
                className="btn btn-primary flex items-center gap-1"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
