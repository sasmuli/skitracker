"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser-client";
import { AVATAR_OPTIONS } from "@/types";
import { updateProfile } from "@/lib/actions";

export default function OnboardingPage() {
  const supabase = createSupabaseBrowserClient();
  const router = useRouter();

  const [displayName, setDisplayName] = useState("");
  const [avatar, setAvatar] = useState<string>("blue");
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    async function checkAuthAndLoadProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      // Load existing profile if any
      const { data: profile } = await supabase
        .from("profiles")
        .select("display_name, avatar_url")
        .eq("id", user.id)
        .maybeSingle();

      if (profile) {
        if (profile.display_name) setDisplayName(profile.display_name);
        if (profile.avatar_url) setAvatar(profile.avatar_url);
      }

      setCheckingAuth(false);
    }

    checkAuthAndLoadProfile();
  }, [supabase, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const result = await updateProfile({
      display_name: displayName,
      avatar_url: avatar,
    });

    if (result.error) {
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  }

  if (checkingAuth) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <p className="text-slate-400 text-sm">Loading...</p>
      </div>
    );
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
            placeholder="e.g. nickname"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="label">Choose an avatar</label>
          <div className="flex flex-wrap gap-3">
            {AVATAR_OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setAvatar(option.id)}
                className={`avatar-option ${
                  avatar === option.id ? "avatar-option-selected" : ""
                }`}
              >
                <div className={`avatar avatar-lg ${option.class}`} />
                <span className="text-[10px] text-slate-400">
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
          {loading ? "Saving..." : "Continue"}
        </button>
      </form>
    </div>
  );
}
