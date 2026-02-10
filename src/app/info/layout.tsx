import Link from "next/link";
import { FloatingLinesBackground } from "@/components/floatinglines-backgorund";
import { Header } from "@/components/header";
import { MobileCardNav } from "@/components/mobile-card-nav";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { getCurrentUserWithProfile } from "@/lib/queries";
import { LogoutButton } from "@/components/logout-button";
import { Avatar } from "@/components/avatar";
import { LogIn, UserPlus } from "lucide-react";
import { NotificationDropdown } from "@/components/notification-dropdown";

export default async function InfoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServerClient();
  const { user, profile } = await getCurrentUserWithProfile(supabase);

  let headerRightSlot: React.ReactNode = null;

  if (!user) {
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

    headerRightSlot = (
      <>
        <NotificationDropdown />
        <Link href="/dashboard/profile" className="profile-link">
          <Avatar avatarUrl={profile?.avatar_url} size="sm" />
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
    <div className="page-container">
      <FloatingLinesBackground />
      <MobileCardNav isAuthenticated={!!user} isUserAdmin={profile?.admin || false} />
      <Header rightSlot={headerRightSlot} isAuthenticated={!!user} isUserAdmin={profile?.admin || false} />
      <main className="page-content">{children}</main>
    </div>
  );
}
