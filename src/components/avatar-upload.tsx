'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Camera, X, Loader2, ImagePlus } from 'lucide-react';
import { AVATAR_OPTIONS, isCustomAvatarUrl } from '@/types';
import { uploadAvatar, deleteAvatar } from '@/lib/actions';

type AvatarUploadProps = {
  currentAvatar: string;
  onAvatarChange: (newAvatar: string) => void;
  size?: 'sm' | 'md' | 'lg';
};

export function AvatarUpload({ 
  currentAvatar, 
  onAvatarChange,
  size = 'lg' 
}: AvatarUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Detect mobile device
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
  }, []);

  const isCustomImage = isCustomAvatarUrl(currentAvatar);
  
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20',
  };

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setUploading(true);

    const formData = new FormData();
    formData.append('avatar', file);

    const result = await uploadAvatar(formData);

    setUploading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    if (result.avatarUrl) {
      onAvatarChange(result.avatarUrl);
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  async function handleRemoveCustomAvatar() {
    setError(null);
    setUploading(true);

    const result = await deleteAvatar();

    setUploading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    onAvatarChange('blue');
  }

  function handleColorSelect(colorId: string) {
    onAvatarChange(colorId);
  }

  return (
    <div className="space-y-4">
      {/* Current Avatar Preview */}
      <div className="flex items-center gap-4">
        <div className="relative">
          {isCustomImage ? (
            <div className={`${sizeClasses[size]} rounded-full overflow-hidden ring-2 ring-sky-500/50`}>
              <Image
                src={currentAvatar}
                alt="Your avatar"
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div 
              className={`avatar ${sizeClasses[size]} ${
                AVATAR_OPTIONS.find(o => o.id === currentAvatar)?.class || 'avatar-blue'
              }`} 
            />
          )}
          
          {/* Upload overlay button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-sky-500 hover:bg-sky-400 flex items-center justify-center transition-colors shadow-lg"
            title="Upload photo"
          >
            {uploading ? (
              <Loader2 className="w-4 h-4 text-white animate-spin" />
            ) : (
              <Camera className="w-4 h-4 text-white" />
            )}
          </button>
        </div>

        <div className="flex-1">
          <p className="text-sm font-medium">Profile Picture</p>
          <p className="text-xs text-slate-400">
            {isCustomImage 
              ? 'Custom image uploaded' 
              : 'Using color avatar'}
          </p>
          {/* Mobile: Show camera and gallery buttons */}
          {isMobile && (
            <div className="flex gap-2 mt-2">
              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                disabled={uploading}
                className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1"
              >
                <Camera className="w-3 h-3" />
                Take photo
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1"
              >
                <ImagePlus className="w-3 h-3" />
                Gallery
              </button>
            </div>
          )}
          {isCustomImage && (
            <button
              type="button"
              onClick={handleRemoveCustomAvatar}
              disabled={uploading}
              className="text-xs text-red-400 hover:text-red-300 mt-1 flex items-center gap-1"
            >
              <X className="w-3 h-3" />
              Remove custom image
            </button>
          )}
        </div>
      </div>

      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFileChange}
        className="hidden"
      />
      {/* Camera input for mobile */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="user"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Error message */}
      {error && (
        <p className="text-xs text-red-400">{error}</p>
      )}

      {/* Color avatar options (only show if not using custom image) */}
      {!isCustomImage && (
        <div className="space-y-2">
          <label className="text-xs text-slate-400">Or choose a color</label>
          <div className="flex flex-wrap gap-3">
            {AVATAR_OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => handleColorSelect(option.id)}
                className={`avatar-option ${
                  currentAvatar === option.id ? 'avatar-option-selected' : ''
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
      )}

      {/* Help text */}
      <p className="text-xs text-slate-500">
        Upload a JPG, PNG, WebP or GIF (max 5MB)
      </p>
    </div>
  );
}
