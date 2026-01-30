import type { ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';

type HeaderProps = {
  rightSlot?: ReactNode;
  isAuthenticated?: boolean;
  isUserAdmin?: boolean;
};

export function Header({ rightSlot, isAuthenticated = false, isUserAdmin = false }: HeaderProps) {
  return (
    <header className="glass-header px-4 h-16 flex items-center justify-between gap-4 relative">
      {/* Left: main nav (desktop) */}
      <nav className="flex items-center gap-4 text-sm text-slate-300">
        <Link href="/" className="hover:text-white">
          Home
        </Link>
        <Link href="/info" className="hover:text-white">
          Info
        </Link>
        <Link href="/features" className="hover:text-white">
          Features
        </Link>
        {isAuthenticated && (
          <>
            <Link href="/dashboard" className="hover:text-white">
              Dashboard
            </Link>
            <Link href="/leaderboard" className="hover:text-white">
              Leaderboard
            </Link>
            <Link href="/friends" className="hover:text-white">
              Friends
            </Link>
            <Link href="/dashboard/profile" className="hover:text-white">
              Profile
            </Link>
          </>
        )}
        {isAuthenticated && (isUserAdmin) && (
          <Link href="/adminDashboard" className="hover:text-white">
            Admin
          </Link>
        )}
      </nav>

      {/* Center: clickable logo */}
      <Link
        href="/"
        className="lg:absolute lg:left-1/2 lg:-translate-x-1/2"
      >
        <Image 
          src="/logo_ski_tracker_2.png" 
          alt="Ski Tracker" 
          width={120} 
          height={40} 
          className="h-18 lg:h-18 w-auto"
        />
      </Link>

      {/* Right: auth actions or user info */}
      <div className="flex items-center gap-3 ml-auto">
        {rightSlot}
      </div>
    </header>
  );
}
