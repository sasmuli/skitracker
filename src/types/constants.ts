// Ski Types
export const SKI_TYPES = [
  { id: 'piste', label: 'Piste', color: '#22c55e' },
  { id: 'park', label: 'Park', color: '#ef4444' },
  { id: 'freeride', label: 'Freeride', color: '#f97316' },
  { id: 'touring', label: 'Touring', color: '#a855f7' },
  { id: 'street', label: 'Street', color: '#06b6d4' },
] as const;

export type SkiType = (typeof SKI_TYPES)[number]['id'];

// Avatar Options
export const AVATAR_OPTIONS = [
  { id: 'blue', label: 'Blue', class: 'avatar-blue' },
  { id: 'green', label: 'Green', class: 'avatar-green' },
  { id: 'orange', label: 'Orange', class: 'avatar-orange' },
  { id: 'purple', label: 'Purple', class: 'avatar-purple' },
  { id: 'pink', label: 'Pink', class: 'avatar-pink' },
  { id: 'cyan', label: 'Cyan', class: 'avatar-cyan' },
] as const;

export type AvatarColor = (typeof AVATAR_OPTIONS)[number]['id'];

// Helper to get avatar CSS class
export function getAvatarClass(avatarKey: string | null | undefined): string {
  const option = AVATAR_OPTIONS.find((o) => o.id === avatarKey);
  return option?.class || 'avatar-blue';
}

// Check if avatar_url is a custom uploaded image (URL) vs a color ID
export function isCustomAvatarUrl(avatarUrl: string | null | undefined): boolean {
  if (!avatarUrl) return false;
  return avatarUrl.startsWith('http://') || avatarUrl.startsWith('https://');
}
