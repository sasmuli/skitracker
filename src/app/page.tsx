import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { getCurrentUserWithProfile } from "@/lib/queries";
import { getAvatarClass } from "@/types";
import { LogoutButton } from "@/components/logout-button";
import { Header } from "@/components/header";
import { MobileCardNav } from "@/components/mobile-card-nav";
import { LogIn, UserPlus } from "lucide-react";
import { FloatingLinesBackground } from "@/components/floatinglines-backgorund";

export default async function HomePage() {
  const supabase = await createSupabaseServerClient();
  const { user, profile } = await getCurrentUserWithProfile(supabase);

  let headerRightSlot = null;

  if (!user) {
    // Header shows auth buttons, MobileCardNav has them in dropdown
    headerRightSlot = (
      <div className="auth-buttons-desktop">
        <Link href="/login" className="btn btn-primary">
          <LogIn className="w-4 h-4" />
          Log in
        </Link>
        <Link href="/signup" className="btn btn-secondary">
          <UserPlus className="w-4 h-4" />
          Sign up
        </Link>
      </div>
    );
  } else {
    const displayName = profile?.display_name || user.email || "Ski friend";
    const avatarClass = getAvatarClass(profile?.avatar_url);

    headerRightSlot = (
      <>
        <Link href="/dashboard/profile" className="profile-link">
          <div className={`avatar ${avatarClass}`} />
          <div className="hidden sm:flex flex-col">
            <span className="text-xs font-medium">{displayName}</span>
            <span className="text-[10px] text-[var(--color-text-muted)]">
              {user.email}
            </span>
          </div>
        </Link>
        <LogoutButton />
      </>
    );
  }

  return (
    <div>
      <FloatingLinesBackground />
      <MobileCardNav isAuthenticated={!!user} />
      <Header rightSlot={headerRightSlot} isAuthenticated={!!user} />

      <main className="flex flex-col items-center justify-center py-10">
        <h1 className="text-3xl font-bold mb-4">Welcome to Ski Tracker</h1>
        <p className="mb-6">Landing page</p>

        {user ? (
          <Link href="/dashboard" className="btn btn-primary">
            Go to App
          </Link>
        ) : null}
      </main>
    </div>
  );
}
