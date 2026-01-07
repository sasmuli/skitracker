"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createResort } from "@/lib/actions";
import { BackButton } from "@/components/back-button";

function toNumberOrNull(v: string): number | null {
  const s = v.trim();
  if (!s) return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

export default function AddResortPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [locationArea, setLocationArea] = useState("");
  const [locationCity, setLocationCity] = useState("");
  const [locationCountry, setLocationCountry] = useState("");
  const [heightM, setHeightM] = useState("");
  const [lifts, setLifts] = useState("");
  const [skislopesKm, setSkislopesKm] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name.trim()) {
      setErrorMsg("Resort name is required.");
      return;
    }

    if (!locationCountry.trim()) {
      setErrorMsg("Country is required.");
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);

    const input = {
      name,
      location_area: locationArea || null,
      location_city: locationCity || null,
      location_country: locationCountry || null,
      height_m: toNumberOrNull(heightM),
      lifts: toNumberOrNull(lifts),
      skislopes_km: toNumberOrNull(skislopesKm),
    };

    try {
      const result = await createResort(input);

      if (result.error) {
        setErrorMsg(result.error);
        setSubmitting(false);
        return;
      }

      router.push("/info");
    } catch (err) {
      console.error("Failed to save:", err);
      setErrorMsg("Failed to save. Please try again.");
      setSubmitting(false);
    }
  }

  function handleReset() {
    setName("");
    setLocationArea("");
    setLocationCity("");
    setLocationCountry("");
    setHeightM("");
    setLifts("");
    setSkislopesKm("");
    setErrorMsg(null);
  }

  return (
    <div className="mx-auto w-full max-w-xl px-4 sm:px-0">
      <header className="mb-6 text-center">
        <h1 className="text-2xl font-semibold text-[var(--foreground)]">
          Add resort
        </h1>
        <p className="mt-2 text-sm text-[var(--color-text-muted)]">
          Add a missing ski resort to the shared list. Please fill the information in English.
        </p>
        <p className="mt-1 text-xs text-slate-500">
          * indicates required fields
        </p>
      </header>

      <div className="glass-card">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="label">Resort name*</label>
            <input
              type="text"
              className="input"
              placeholder="Name of the resort"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="label">Location / Area</label>
            <input
              type="text"
              className="input"
              placeholder="County or area where the resort is located, e.g. Northern Ostrobothnia"
              value={locationArea}
              onChange={(e) => setLocationArea(e.target.value)}
            />
          </div>

          <div>
            <label className="label">City</label>
            <input
              type="text"
              className="input"
              placeholder="City where the resort is located"
              value={locationCity}
              onChange={(e) => setLocationCity(e.target.value)}
            />
          </div>

          <div>
            <label className="label">Country*</label>
            <input
              type="text"
              className="input"
              placeholder="Country where the resort is located"
              value={locationCountry}
              onChange={(e) => setLocationCountry(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="label">Vertical height (m)</label>
              <input
                type="number"
                min={0}
                className="input"
                placeholder="e.g. 492"
                value={heightM}
                onChange={(e) => setHeightM(e.target.value)}
              />
            </div>

            <div>
              <label className="label">Number of lifts</label>
              <input
                type="number"
                min={0}
                className="input"
                placeholder="e.g. 22"
                value={lifts}
                onChange={(e) => setLifts(e.target.value)}
              />
            </div>

            <div>
              <label className="label">Slope length (km)</label>
              <input
                type="number"
                min={0}
                step="0.1"
                className="input"
                placeholder="e.g. 19.1"
                value={skislopesKm}
                onChange={(e) => setSkislopesKm(e.target.value)}
              />
            </div>
          </div>

          {errorMsg && <p className="text-xs text-red-400">{errorMsg}</p>}

          <div className="pt-4 flex items-center justify-between">
            <div className="flex gap-3">
              <BackButton className="btn btn-secondary">Cancel</BackButton>

              <button
                type="button"
                onClick={handleReset}
                className="btn btn-secondary"
              >
                Clear
              </button>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? "Saving…" : "Submit resort"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
