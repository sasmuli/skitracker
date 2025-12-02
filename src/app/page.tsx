import Link from 'next/link';
import { createSupabaseServerClient } from '@/lib/supabase/server-client';
import { LogoutButton } from '@/components/logout-button';
import { Header } from '@/components/header';
import { LogIn, UserPlus } from 'lucide-react';


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
          className="text-sm px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-md flex items-center gap-2"
        >
          <LogIn className="w-4 h-4" />
          Log in
        </Link>

        <Link
          href="/signup"
          className="text-sm px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-md border border-slate-600 flex items-center gap-2"
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
          <div className={`w-8 h-8 rounded-full ${avatarClasses}`} />
          <div className="flex flex-col">
            <span className="text-xs font-medium">{displayName}</span>
            <span className="text-[10px] text-slate-400">{user.email}</span>
          </div>
        </div>
        <LogoutButton />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Header rightSlot={rightSlot} />

      <main className="flex flex-col items-center justify-center py-10">
        <h1 className="text-3xl font-bold mb-4">Welcome to Ski Tracker</h1>
        <p className="text-slate-400 mb-6">Landing page</p>

        {user ? (
          <Link
            href="/app"
            className="px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg"
          >
            Go to App
          </Link>
        ) : null}
      </main>
    </div>
  );
}
