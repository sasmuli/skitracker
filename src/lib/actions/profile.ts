'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server-client';
import type { ProfileInput } from '@/types';

export async function updateProfile(input: ProfileInput) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Not authenticated' };
  }

  const { error } = await supabase.from('profiles').upsert({
    id: user.id,
    display_name: input.display_name,
    avatar_url: input.avatar_url,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

export async function uploadAvatar(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Not authenticated' };
  }

  const file = formData.get('avatar') as File;
  if (!file) {
    return { error: 'No file provided' };
  }

  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (!allowedTypes.includes(file.type)) {
    return { error: 'Invalid file type. Please upload a JPEG, PNG, WebP, or GIF.' };
  }

  // Validate file size (max 5MB)
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    return { error: 'File too large. Maximum size is 5MB.' };
  }

  // Generate unique filename
  const fileExt = file.name.split('.').pop();
  const fileName = `${user.id}/${Date.now()}.${fileExt}`;

  // Delete old avatar if exists
  const { data: oldFiles } = await supabase.storage
    .from('avatars')
    .list(user.id);

  if (oldFiles && oldFiles.length > 0) {
    const filesToDelete = oldFiles.map(f => `${user.id}/${f.name}`);
    await supabase.storage.from('avatars').remove(filesToDelete);
  }

  // Upload new avatar
  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: true,
    });

  if (uploadError) {
    return { error: uploadError.message };
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from('avatars')
    .getPublicUrl(fileName);

  const avatarUrl = urlData.publicUrl;

  // Update profile with new avatar URL
  const { error: updateError } = await supabase.from('profiles').upsert({
    id: user.id,
    avatar_url: avatarUrl,
  });

  if (updateError) {
    return { error: updateError.message };
  }

  return { success: true, avatarUrl };
}

export async function deleteAvatar() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Not authenticated' };
  }

  // Delete all files in user's avatar folder
  const { data: files } = await supabase.storage
    .from('avatars')
    .list(user.id);

  if (files && files.length > 0) {
    const filesToDelete = files.map(f => `${user.id}/${f.name}`);
    await supabase.storage.from('avatars').remove(filesToDelete);
  }

  // Reset avatar_url to default color
  const { error } = await supabase.from('profiles').upsert({
    id: user.id,
    avatar_url: 'blue',
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}
