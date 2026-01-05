import AnimatedList from "@/components/animated-list";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { getResorts } from "@/lib/queries/resorts";

export default async function InfoPage() {
  const supabase = await createSupabaseServerClient();
  const resorts = await getResorts(supabase);
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
        <h2 className="text-xl font-semibold mb-4 text-center text-[var(--foreground)]">
          Resorts
        </h2>

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
