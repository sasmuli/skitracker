// src/app/signup/page.tsx
'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase/browser-client';

export default function SignupPage() {
  const supabase = createSupabaseBrowserClient();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSignup(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    // Redirect to onboarding
    if (data.user) {
      router.push('/app/onboarding'); // use correct path depending on your folders
    }
  }

  return (
    <form
      onSubmit={handleSignup}
      className="w-full max-w-md space-y-4 bg-slate-900 p-6 rounded-xl border border-slate-800"
    >
      <h1 className="text-xl font-semibold text-center">Create account</h1>

      <div className="space-y-1">
        <label className="text-xs text-slate-400">Email</label>
        <input
          type="email"
          required
          className="w-full px-3 py-2 rounded-md border border-slate-700 bg-slate-950 text-slate-100 text-sm"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs text-slate-400">Password</label>
        <input
          type="password"
          required
          minLength={6}
          className="w-full px-3 py-2 rounded-md border border-slate-700 bg-slate-950 text-slate-100 text-sm"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {errorMsg && <p className="text-xs text-red-400">{errorMsg}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-sm font-medium"
      >
        {loading ? 'Creating account...' : 'Sign up'}
      </button>

      <p className="text-xs text-center text-slate-400">
        Already have an account?{' '}
        <button
          type="button"
          onClick={() => router.push('/login')}
          className="underline"
        >
          Log in
        </button>
      </p>
    </form>
  );
}
