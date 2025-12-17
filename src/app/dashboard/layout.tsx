import { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createSupabaseServerClient } from '@/lib/supabase/server-client';
import { getCurrentUserWithProfile } from '@/lib/queries';
import { getAvatarClass } from '@/types';
import { LogoutButton } from '@/components/logout-button';
import { Header } from '@/components/header';

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const supabase = await createSupabaseServerClient();
  const { user, profile } = await getCurrentUserWithProfile(supabase);

  if (!user) {
    redirect('/login');
  }

  const displayName = profile?.display_name || user.email || 'Ski friend';
  const avatarClass = getAvatarClass(profile?.avatar_url);

  return (
    <div className="page-container">
      <Header
        isAuthenticated={true}
        rightSlot={
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
        }
      />

      <main className="page-content">
        {children}
      </main>
    </div>
  );
}
