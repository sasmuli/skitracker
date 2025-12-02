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
      className="glass-card w-full max-w-md space-y-4 animate-fade-in"
    >
      <h1 className="text-xl font-semibold text-center">Create account</h1>

      <div className="space-y-1">
        <label className="label">Email</label>
        <input
          type="email"
          required
          className="input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="space-y-1">
        <label className="label">Password</label>
        <input
          type="password"
          required
          minLength={6}
          className="input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {errorMsg && <p className="error-text">{errorMsg}</p>}

      <button
        type="submit"
        disabled={loading}
        className="btn btn-primary w-full"
      >
        {loading ? 'Creating account...' : 'Sign up'}
      </button>

      <p className="text-xs text-center text-[var(--color-text-muted)]">
        Already have an account?{' '}
        <button
          type="button"
          onClick={() => router.push('/login')}
          className="btn-link"
        >
          Log in
        </button>
      </p>
    </form>
  );
}
