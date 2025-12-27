"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser-client";
import { AVATAR_OPTIONS } from "@/types";
import { updateProfile } from "@/lib/actions";
import { PasswordInput } from "@/components/password-input";
import { User, Mail, Lock, Trash2, Check, AlertTriangle } from "lucide-react";

export default function ProfilePage() {
  const supabase = createSupabaseBrowserClient();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [avatar, setAvatar] = useState("blue");

  // Form states
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      setEmail(user.email || "");

      const { data: profile } = await supabase
        .from("profiles")
        .select("display_name, avatar_url")
        .eq("id", user.id)
        .maybeSingle();

      if (profile) {
        setDisplayName(profile.display_name || "");
        setAvatar(profile.avatar_url || "blue");
      }

      setLoading(false);
    }

    loadProfile();
  }, [supabase, router]);

  async function handleSaveProfile() {
    setSavingProfile(true);
    setProfileSuccess(false);

    const result = await updateProfile({
      display_name: displayName,
      avatar_url: avatar,
    });

    setSavingProfile(false);

    if (result.error) {
      return;
    }

    setProfileSuccess(true);
    router.refresh();
    setTimeout(() => setProfileSuccess(false), 3000);
  }

  async function handleChangePassword() {
    setPasswordError(null);
    setPasswordSuccess(false);

    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }

    setSavingPassword(true);

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    setSavingPassword(false);

    if (error) {
      setPasswordError(error.message);
      return;
    }

    setPasswordSuccess(true);
    setNewPassword("");
    setConfirmPassword("");

    setTimeout(() => setPasswordSuccess(false), 3000);
  }

  async function handleDeleteAccount() {
    if (deleteConfirmText !== "DELETE") {
      setDeleteError("Please type DELETE to confirm.");
      return;
    }

    setDeleting(true);
    setDeleteError(null);

    try {
      // Get the current session for the auth header
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setDeleteError("Not authenticated.");
        setDeleting(false);
        return;
      }

      // Call the Supabase Edge Function to delete the account
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/delete-account`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setDeleteError(data.error || "Failed to delete account.");
        setDeleting(false);
        return;
      }

      // Sign out and redirect
      await supabase.auth.signOut();
      router.push("/");
    } catch {
      setDeleteError("Failed to delete account. Please try again.");
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <p className="text-slate-400 text-sm">Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Profile Settings</h1>
        <p className="text-sm text-slate-400">
          Manage your account and preferences
        </p>
      </div>

      {/* Profile Section */}
      <section className="profile-section">
        <div className="profile-section-header">
          <User className="w-5 h-5 text-sky-400" />
          <h2 className="text-lg font-medium">Profile</h2>
        </div>

        <div className="space-y-4">
          {/* Display Name */}
          <div className="space-y-1">
            <label className="text-xs text-slate-400">Display Name</label>
            <input
              type="text"
              className="input"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your display name"
            />
          </div>

          {/* Avatar Selection */}
          <div className="space-y-2">
            <label className="text-xs text-slate-400">Avatar Color</label>
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

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleSaveProfile}
              disabled={savingProfile}
              className="btn btn-primary"
            >
              {savingProfile ? "Saving..." : "Save Profile"}
            </button>
            {profileSuccess && (
              <span className="flex items-center gap-1 text-xs text-green-400">
                <Check className="w-4 h-4" />
                Saved!
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Email Section */}
      <section className="profile-section">
        <div className="profile-section-header">
          <Mail className="w-5 h-5 text-sky-400" />
          <h2 className="text-lg font-medium">Email</h2>
        </div>

        <div className="space-y-1">
          <label className="text-xs text-slate-400">Email Address</label>
          <input
            type="email"
            className="input"
            value={email}
            disabled
            readOnly
          />
          <p className="text-xs text-slate-500">
            Email cannot be changed. Contact support if you need to update it.
          </p>
        </div>
      </section>

      {/* Password Section */}
      <section className="profile-section">
        <div className="profile-section-header">
          <Lock className="w-5 h-5 text-sky-400" />
          <h2 className="text-lg font-medium">Change Password</h2>
        </div>

        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs text-slate-400">New Password</label>
            <PasswordInput
              value={newPassword}
              onChange={setNewPassword}
              placeholder="Enter new password"
              minLength={6}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-slate-400">
              Confirm New Password
            </label>
            <PasswordInput
              value={confirmPassword}
              onChange={setConfirmPassword}
              placeholder="Confirm new password"
              minLength={6}
            />
          </div>

          {passwordError && (
            <p className="text-xs text-red-400">{passwordError}</p>
          )}

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleChangePassword}
              disabled={savingPassword || !newPassword || !confirmPassword}
              className="btn btn-primary"
            >
              {savingPassword ? "Updating..." : "Update Password"}
            </button>
            {passwordSuccess && (
              <span className="flex items-center gap-1 text-xs text-green-400">
                <Check className="w-4 h-4" />
                Password updated!
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Danger Zone */}
      <section className="profile-section profile-section-danger">
        <div className="profile-section-header">
          <Trash2 className="w-5 h-5 text-red-400" />
          <h2 className="text-lg font-medium text-red-400">Account deletion</h2>
        </div>

        {!showDeleteConfirm ? (
          <div>
            <p className="text-sm text-slate-400 mb-4">
              Permanently delete your account and all associated data. This
              action cannot be undone.
            </p>
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="btn btn-danger"
            >
              Delete Account
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-red-300 font-medium">
                  Are you absolutely sure?
                </p>
                <p className="text-xs text-red-400/80 mt-1">
                  This will permanently delete your account, profile, and all
                  ski day records.
                </p>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-400">
                Type <span className="text-red-400 font-mono">DELETE</span> to
                confirm
              </label>
              <input
                type="text"
                className="input"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="DELETE"
              />
            </div>

            {deleteError && (
              <p className="text-xs text-red-400">{deleteError}</p>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeleteConfirmText("");
                  setDeleteError(null);
                }}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={deleting || deleteConfirmText !== "DELETE"}
                className="btn btn-danger"
              >
                {deleting ? "Deleting..." : "Delete My Account"}
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
