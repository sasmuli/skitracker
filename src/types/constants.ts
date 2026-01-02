// Ski Types
export const SKI_TYPES = [
  { id: 'piste', label: 'Piste' },
  { id: 'park', label: 'Park' },
  { id: 'freeride', label: 'Freeride' },
  { id: 'touring', label: 'Touring' },
  { id: 'street', label: 'Street' },
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
