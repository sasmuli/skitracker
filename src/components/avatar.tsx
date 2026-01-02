import Image from 'next/image';
import { getAvatarClass, isCustomAvatarUrl } from '@/types';

type AvatarProps = {
  avatarUrl: string | null | undefined;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
};

const sizeClasses = {
  xs: 'w-6 h-6',
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
  xl: 'w-20 h-20',
};

const imageSizes = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 48,
  xl: 80,
};

export function Avatar({ avatarUrl, size = 'md', className = '' }: AvatarProps) {
  const isCustomImage = isCustomAvatarUrl(avatarUrl);
  const sizeClass = sizeClasses[size];
  const imageSize = imageSizes[size];

  if (isCustomImage && avatarUrl) {
    return (
      <div className={`${sizeClass} rounded-full overflow-hidden flex-shrink-0 ${className}`}>
        <Image
          src={avatarUrl}
          alt="Avatar"
          width={imageSize}
          height={imageSize}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  const avatarClass = getAvatarClass(avatarUrl);
  return (
    <div className={`avatar ${sizeClass} ${avatarClass} ${className}`} />
  );
}
