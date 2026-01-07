import AnimatedList from "@/components/animated-list";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { getResorts } from "@/lib/queries/resorts";
import { getCurrentUserWithProfile } from "@/lib/queries";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function InfoPage() {
  const supabase = await createSupabaseServerClient();
  const [{ user }, resorts] = await Promise.all([
    getCurrentUserWithProfile(supabase),
    getResorts(supabase),
  ]);
  const items = resorts.map((r) => r.name);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 sm:px-0">
      {/* Main info header */}
      <header className="mb-4">
        <h1 className="text-3xl font-semibold text-center text-[var(--foreground)]">
          Info
        </h1>
        <p className="mt-2 text-center text-sm text-[var(--color-text-muted)]">
          Browse resorts and explore Ski Tracker’s public information.
        </p>
      </header>

      {/* Section */}
      <section>
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
      />
    </section>
    </div>
  );
}
