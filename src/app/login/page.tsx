'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase/browser-client';

export default function LoginPage() {
  const supabase = createSupabaseBrowserClient();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    router.push('/app');
  }

  return (
    <form
      onSubmit={handleLogin}
      className="glass-card w-full max-w-md space-y-4 animate-fade-in"
    >
      <h1 className="text-xl font-semibold text-center">Log in</h1>

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
        {loading ? 'Logging in...' : 'Log in'}
      </button>

      <p className="text-xs text-center text-[var(--color-text-muted)]">
        Need an account?{' '}
        <button
          type="button"
          onClick={() => router.push('/signup')}
          className="btn-link"
        >
          Sign up
        </button>
      </p>
    </form>
  );
}
