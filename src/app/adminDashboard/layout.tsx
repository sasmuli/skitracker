import { ReactNode } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { getCurrentUserWithProfile } from "@/lib/queries";
import { LogoutButton } from "@/components/logout-button";
import { Header } from "@/components/header";
import { MobileCardNav } from "@/components/mobile-card-nav";
import { Avatar } from "@/components/avatar";
import LightPillarBackground from "@/components/lightpilar-backgorund";
import { NotificationDropdown } from "@/components/notification-dropdown";

export default async function AdminDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const supabase = await createSupabaseServerClient();
  const { user, profile } = await getCurrentUserWithProfile(supabase);

  if (!user) {
    redirect("/login");
  }

  // Only allow admin users
  if (!profile?.admin) {
    redirect("/dashboard");
  }

  const displayName = profile?.display_name || user.email || "Admin";

  const rightSlot = (
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

  return (
    <div className="page-container">
      <LightPillarBackground />
      <MobileCardNav rightSlot={rightSlot} isAuthenticated={true} isUserAdmin={true} />
      <Header rightSlot={rightSlot} isAuthenticated={true} isUserAdmin={true} />
      <main className="page-content">{children}</main>
    </div>
  );
}