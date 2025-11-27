'use client';

import { useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/browser-client';

export default function LoginPage() {
  const supabase = createSupabaseBrowserClient();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/app`,
      },
    });

    if (error) {
      alert(error.message);
      return;
    }

    setSent(true);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-100">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm space-y-4 bg-slate-900 p-6 rounded-xl border border-slate-800"
      >
        <h1 className="text-xl font-medium">Ski Tracker Login</h1>

        <input
          type="email"
          required
          placeholder="you@email.com"
          className="w-full px-3 py-2 rounded border border-slate-700 bg-slate-950 text-slate-100"
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          type="submit"
          className="w-full px-4 py-2 rounded bg-blue-600 hover:bg-blue-500"
        >
          Send magic link
        </button>

        {sent && (
          <p className="text-xs text-slate-400 text-center">
            A login link has been sent to your email.
          </p>
        )}
      </form>
    </div>
  );
}
