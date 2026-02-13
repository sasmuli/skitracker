"use client";

import { useEffect, useState } from "react";
import AnimatedList from "@/components/animated-list";
import { ResortInfoDialog } from "@/components/resort-info-dialog";
import { InfoStatsCards } from "@/components/info-stats-cards";
import { InfoContactSupport } from "@/components/info-contact-support";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser-client";
import { getResorts } from "@/lib/queries/resorts";
import { getCurrentUserWithProfile } from "@/lib/queries";
import { Plus } from "lucide-react";
import Link from "next/link";
import type { Resort } from "@/types";

export default function InfoPage() {
  const [resorts, setResorts] = useState<Resort[]>([]);
  const [user, setUser] = useState<any>(null);
  const [selectedResort, setSelectedResort] = useState<Resort | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const supabase = createSupabaseBrowserClient();
      const [{ user: authUser }, resortsData] = await Promise.all([
        getCurrentUserWithProfile(supabase),
        getResorts(supabase),
      ]);
      setUser(authUser);
      setResorts(resortsData);
    }
    fetchData();
  }, []);

  const handleResortClick = (item: string, index: number) => {
    setSelectedResort(resorts[index]);
    setIsDialogOpen(true);
  };

  const items = resorts.map((r) => r.name);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-0">
      {/* Main info header */}
      <header className="mb-4">
        <h1 className="text-3xl font-semibold text-center text-[var(--foreground)]">
          Info
        </h1>
        <p className="mt-2 text-center text-sm text-[var(--color-text-muted)]">
          Browse resorts and explore Ski Tracker’s public information.
        </p>
      </header>

      {/* Quick Statistics */}
      <InfoStatsCards />

      {/* Resorts Section */}
      <section style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-6">
          <div>
            <h2 className="text-xl font-semibold text-[var(--foreground)]">
              Resorts
            </h2>
            {user ? (
              <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                Browse all resorts. If one is missing, you can add it.
              </p>
            ) : (
              <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                Browse all available resorts. Sign in to add missing ones.
              </p>
            )}
            <p className="mt-1 text-xs text-[var(--accent)]">
              Press resort to see info
            </p>
          </div>

          {user && (
            <Link href="/info/add-resort" className="btn btn-primary shrink-0">
              <Plus className="w-4 h-4" />
              Add resort
            </Link>
          )}
        </div>

        <AnimatedList
          items={items}
          showGradients={false}
          enableArrowNavigation
          displayScrollbar
          onItemSelect={handleResortClick}
        />

        <ResortInfoDialog
          resort={selectedResort}
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
        />
      </section>

      {/* Contact & Support */}
      <InfoContactSupport /> {/* Configure resend and create contact form */}
    </div>
  );
}
