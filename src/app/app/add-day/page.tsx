// src/app/app/add-day/page.tsx
'use client';

import { useEffect, useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase/browser-client';
import { SnowflakeRating } from '@/components/snowflake-raiting';

type Resort = {
  id: string;
  name: string;
};

type SkiType = 'piste' | 'park' | 'freeride' | 'touring' | 'street';

const SKI_TYPES: { id: SkiType; label: string }[] = [
  { id: 'piste', label: 'Piste' },
  { id: 'park', label: 'Park' },
  { id: 'freeride', label: 'Freeride' },
  { id: 'touring', label: 'Touring' },
  { id: 'street', label: 'Street' },
];

function openNativeDatePicker(input: HTMLInputElement) {
  (input as any).showPicker?.();
}

const TODAY = new Date().toISOString().slice(0, 10);

export default function AddSkiDayPage() {
  const supabase = createSupabaseBrowserClient();
  const router = useRouter();

  const [resorts, setResorts] = useState<Resort[]>([]);
  const [loadingResorts, setLoadingResorts] = useState(true);

  const [date, setDate] = useState<string>(() => {
    // default to today
    const d = new Date();
    return d.toISOString().slice(0, 10);
  });
  const [resortId, setResortId] = useState<string>('');
  const [hours, setHours] = useState<string>('');
  const [distanceKm, setDistanceKm] = useState<string>('');
  const [rating, setRating] = useState<number>(0);
  const [notes, setNotes] = useState<string>('');
  const [selectedTypes, setSelectedTypes] = useState<SkiType[]>([]);

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

  function toggleSkiType(type: SkiType) {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setErrorMsg('You must be logged in to add a ski day.');
        setSubmitting(false);
        return;
      }

      if (!resortId) {
        setErrorMsg('Please select a resort.');
        setSubmitting(false);
        return;
      }

      const { error } = await supabase.from('ski_days').insert({
        user_id: user.id,
        date,
        resort_id: resortId,
        hours: hours ? Number(hours) : null,
        distance_km: distanceKm ? Number(distanceKm) : null,
        rating: rating || null,
        notes: notes || null,
        ski_types: selectedTypes.length > 0 ? selectedTypes : null,
      });

      if (error) {
        setErrorMsg(error.message);
        setSubmitting(false);
        return;
      }

      // success → go back to dashboard
      router.push('/app');
      router.refresh();
    } finally {
      // router.push will navigate anyway; this is safe
      setSubmitting(false);
    }
  }

  return (
    <div className="p-6 flex justify-center">
      <form
        onSubmit={handleSubmit}
        className="glass-card w-full max-w-xl space-y-5 relative"
      >
        <div>
          <h1 className="text-xl font-semibold">Add Ski Day</h1>
          <p className="text-xs text-slate-400">
            Log your session to track your season progress.
          </p>
        </div>

        {/* Date */}
        <div className="space-y-1">
          <label className="text-xs text-slate-400">Date</label>
          <input
            type="date"
            required
            className="input"
            value={date}
            max={TODAY}
            onChange={(e) => setDate(e.target.value)}
            onMouseDown={(e) => {
              e.preventDefault();
              openNativeDatePicker(e.currentTarget);
            }}
          />
        </div>

        {/* Resort */}
        <div className="space-y-1">
          <label className="text-xs text-slate-400">Resort</label>
          <select
            className="input input-select"
            value={resortId}
            onChange={(e) => setResortId(e.target.value)}
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
              value={hours}
              onChange={(e) => setHours(e.target.value)}
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
              value={distanceKm}
              onChange={(e) => setDistanceKm(e.target.value)}
              placeholder="Select distance"
            />
          </div>
        </div>

        {/* Rating */}
        <div className="space-y-2">
          <label className="text-xs text-slate-400">Rating (0–5)</label>
          <div className="flex justify-center">
            <SnowflakeRating value={rating} onChange={setRating} />
          </div>
        </div>

        {/* Ski types (multi-select) */}
        <div className="space-y-3">
          <label className="text-xs text-slate-400">
            What did you ski? (select one or more)
          </label>
          <div className="flex flex-wrap gap-2">
            {SKI_TYPES.map((type) => {
              const active = selectedTypes.includes(type.id);
              return (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => toggleSkiType(type.id)}
                  className={`text-xs px-3 py-1 rounded-full border ${
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
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Weather, snow conditions, tricks you learned…"
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
            type="submit"
            disabled={submitting || loadingResorts || resorts.length === 0}
            className="btn btn-primary"
          >
            {submitting ? 'Saving…' : 'Save ski day'}
          </button>
        </div>
      </form>
    </div>
  );
}
