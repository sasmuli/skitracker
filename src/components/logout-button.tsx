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
      className="btn btn-secondary"
    >
      <LogOut className="w-4 h-4" />
      Log out
    </button>
  );
}
