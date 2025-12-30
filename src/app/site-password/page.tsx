'use client';

import { useState, FormEvent, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock } from 'lucide-react';

function PasswordForm() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/site-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push(redirectTo);
      router.refresh();
    } else {
      setError('Incorrect password');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-black">
      <div className="glass-card w-full max-w-sm">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-sky-500/20 flex items-center justify-center">
            <Lock className="w-8 h-8 text-sky-400" />
          </div>
        </div>
        
        <h1 className="text-xl font-semibold text-center mb-2">Protected Site</h1>
        <p className="text-sm text-slate-400 text-center mb-6">
          Enter the password to access this site
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="label">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              placeholder="Enter password"
              required
              autoFocus
            />
          </div>

          {error && (
            <p className="text-sm text-red-400 text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full"
          >
            {loading ? 'Checking...' : 'Enter'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function SitePasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center p-4 bg-black">
        <div className="glass-card w-full max-w-sm animate-pulse">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-sky-500/20" />
          </div>
          <div className="h-6 bg-slate-700 rounded mb-2 mx-auto w-32" />
          <div className="h-4 bg-slate-700 rounded mb-6 mx-auto w-48" />
          <div className="h-10 bg-slate-700 rounded mb-4" />
          <div className="h-10 bg-slate-700 rounded" />
        </div>
      </div>
    }>
      <PasswordForm />
    </Suspense>
  );
}
