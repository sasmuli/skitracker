import { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server-client';
import { LogoutButton } from '@/components/logout-button';
import { Header } from '@/components/header';

function getAvatarClasses(avatarKey: string | null | undefined): string {
  switch (avatarKey) {
    case 'green':
      return 'avatar-green';
    case 'orange':
      return 'avatar-orange';
    case 'purple':
      return 'avatar-purple';
    case 'cyan':
      return 'avatar-cyan';
    case 'pink':
      return 'avatar-pink';
    case 'blue':
    default:
      return 'avatar-blue';
  }
}

export default async function AppLayout({ children }: { children: ReactNode }) {
  const supabase = createSupabaseServerClient();

  // Get current user
  const {
    data: { user },
  } = await (await supabase).auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Load profile
  const { data: profile } = await (await supabase)
    .from('profiles')
    .select('display_name, avatar_url')
    .eq('id', user.id)
    .maybeSingle();

  const displayName = profile?.display_name || user.email || 'Ski friend';
  const avatarKey = profile?.avatar_url || 'orange';
  const avatarClasses = getAvatarClasses(avatarKey);

  return (
    <div className="page-container">
      <Header
        rightSlot={
          <>
            <div className="flex items-center gap-2">
              <div className={`avatar ${avatarClasses}`} />
              <div className="flex flex-col">
                <span className="text-xs font-medium">{displayName}</span>
                <span className="text-[10px] text-[var(--color-text-muted)]">
                  {user.email}
                </span>
              </div>
            </div>

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
