// src/app/signup/page.tsx
'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase/browser-client';
import { PasswordInput } from '@/components/password-input';
import { Mail } from 'lucide-react';

export default function SignupPage() {
  const supabase = createSupabaseBrowserClient();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);

  async function handleSignup(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/onboarding`,
      },
    });

    setLoading(false);

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    // Show confirmation message
    if (data.user) {
      setEmailSent(true);
    }
  }

  // Show email confirmation message after signup
  if (emailSent) {
    return (
      <div className="glass-card w-full max-w-md space-y-4 animate-fade-in text-center">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-sky-500/20 flex items-center justify-center">
            <Mail className="w-8 h-8 text-sky-400" />
          </div>
        </div>
        <h1 className="text-xl font-semibold">Check your email</h1>
        <p className="text-sm text-slate-400">
          We sent a confirmation link to <span className="text-slate-200">{email}</span>
        </p>
        <p className="text-xs text-slate-500">
          Click the link in your email to complete signup and set up your profile.
        </p>
        <button
          type="button"
          onClick={() => router.push('/login')}
          className="btn btn-secondary w-full mt-4"
        >
          Back to login
        </button>
      </div>
    );
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
          placeholder='Enter Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="space-y-1">
        <label className="label">Password</label>
        <PasswordInput
          value={password}
          onChange={setPassword}
          required
          minLength={6}
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
