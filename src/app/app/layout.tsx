import { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server-client';
import { LogoutButton } from '@/components/logout-button';
import { Header } from '@/components/header';

function getAvatarClasses(avatarKey: string | null | undefined): string {
  switch (avatarKey) {
    case 'green':
      return 'bg-emerald-500';
    case 'orange':
      return 'bg-orange-500';
    case 'purple':
      return 'bg-purple-500';
    case 'blue':
    default:
      return 'bg-blue-500';
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
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Header
        rightSlot={
          <>
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full ${avatarClasses}`} />
              <div className="flex flex-col">
                <span className="text-xs font-medium">{displayName}</span>
                <span className="text-[10px] text-slate-400">
                  {user.email}
                </span>
              </div>
            </div>

            <LogoutButton />
          </>
        }
      />

      <main className="px-4 py-6 max-w-5xl mx-auto">
        {children}
      </main>
    </div>
  );
}
