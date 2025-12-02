'use client';

import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase/browser-client';
import { LogOut} from 'lucide-react';


export function LogoutButton() {
  const supabase = createSupabaseBrowserClient();
  const router = useRouter();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push('/');
  }

  return (
    <button
      onClick={handleLogout}
      className="text-sm px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-md border border-slate-600 flex items-center gap-2"
    >
      <LogOut className="w-4 h-4" />
      Log out
    </button>
  );
}
