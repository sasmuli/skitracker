'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase/browser-client';

type AvatarOption = {
  id: string;
  label: string;
};

const AVATAR_OPTIONS: AvatarOption[] = [
  { id: 'blue', label: 'Blue' },
  { id: 'green', label: 'Green' },
  { id: 'orange', label: 'Orange' },
  { id: 'purple', label: 'Purple' },
];

export default function OnboardingPage() {
  const supabase = createSupabaseBrowserClient();
  const router = useRouter();

  const [displayName, setDisplayName] = useState('');
  const [avatar, setAvatar] = useState<string>('blue');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('display_name, avatar_url')
        .eq('id', user.id)
        .maybeSingle();

      if (profile) {
        if (profile.display_name) setDisplayName(profile.display_name);
        if (profile.avatar_url) setAvatar(profile.avatar_url);
      }
    }

    loadProfile();
  }, [supabase, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push('/login');
      return;
    }

    await supabase.from('profiles').upsert({
      id: user.id,
      display_name: displayName,
      avatar_url: avatar,
    });

    setLoading(false);
    router.push('/app');
  }

  return (
    <div className="glass-card max-w-md mx-auto mt-6 animate-fade-in">
      <h1 className="text-lg font-semibold mb-4">Set up your profile</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="label">Display name</label>
          <input
            type="text"
            required
            className="input"
            placeholder="e.g. Samuli, SkiDad, PowderQueen"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="label">Choose an avatar</label>
          <div className="grid grid-cols-4 gap-3">
            {AVATAR_OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setAvatar(option.id)}
                className={`flex flex-col items-center gap-1 p-2 rounded-lg border transition-all ${
                  avatar === option.id
                    ? 'border-[var(--color-accent)] bg-[var(--color-surface)]'
                    : 'border-[var(--color-border)] bg-transparent hover:border-[var(--color-border-hover)]'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full ${
                    option.id === 'blue'
                      ? 'bg-blue-500'
                      : option.id === 'green'
                      ? 'bg-emerald-500'
                      : option.id === 'orange'
                      ? 'bg-orange-500'
                      : 'bg-purple-500'
                  }`}
                />
                <span className="text-[10px] text-slate-300">
                  {option.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-full"
        >
          {loading ? 'Saving...' : 'Continue'}
        </button>
      </form>
    </div>
  );
}
