import Link from 'next/link';
import { createSupabaseServerClient } from '@/lib/supabase/server-client';
import { LogoutButton } from '@/components/logout-button';
import { Header } from '@/components/header';
import { LogIn, UserPlus } from 'lucide-react';


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

export default async function HomePage() {
  const supabase = createSupabaseServerClient();

  const {
    data: { user },
  } = await (await supabase).auth.getUser();

  let rightSlot = null;

  if (!user) {
    // Not logged in: show Log in + Sign up buttons
    rightSlot = (
      <>
        <Link
          href="/login"
          className="btn btn-primary"
        >
          <LogIn className="w-4 h-4" />
          Log in
        </Link>

        <Link
          href="/signup"
          className="btn btn-secondary"
        >
          <UserPlus className="w-4 h-4" />
          Sign up
        </Link>
      </>
    );

  } else {
    // Logged in: show avatar + name + logout
    const { data: profile } = await (await supabase)
      .from('profiles')
      .select('display_name, avatar_url')
      .eq('id', user.id)
      .maybeSingle();

    const displayName = profile?.display_name || user.email || 'Ski friend';
    const avatarKey = profile?.avatar_url || 'orange';
    const avatarClasses = getAvatarClasses(avatarKey);

    rightSlot = (
      <>
        <div className="flex items-center gap-2">
          <div className={`avatar ${avatarClasses}`} />
          <div className="hidden sm:flex flex-col">
            <span className="text-xs font-medium">{displayName}</span>
            <span className="text-[10px] text-[var(--color-text-muted)]">{user.email}</span>
          </div>
        </div>
        <LogoutButton />
      </>
    );
  }

  return (
    <div className="page-container">
      <Header rightSlot={rightSlot} />

      <main className="flex flex-col items-center justify-center py-10">
        <h1 className="text-3xl font-bold mb-4">Welcome to Ski Tracker</h1>
        <p className="mb-6">Landing page</p>

        {user ? (
          <Link
            href="/app"
            className="btn btn-primary"
          >
            Go to App
          </Link>
        ) : null}
      </main>
    </div>
  );
}
