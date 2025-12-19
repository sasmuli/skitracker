'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';

type HeaderProps = {
  rightSlot?: ReactNode;
  isAuthenticated?: boolean;
};

export function Header({ rightSlot, isAuthenticated = false }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="glass-header px-4 h-16 flex items-center justify-between gap-4 relative">
      {/* Mobile menu button */}
      <button
        type="button"
        className="lg:hidden p-2 -ml-2 text-slate-300 hover:text-white"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Left: main nav (desktop) */}
      <nav className="hidden lg:flex items-center gap-4 text-sm text-slate-300">
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

      {/* Right: auth actions or user info (desktop) */}
      <div className="hidden lg:flex items-center gap-3 ml-auto">
        {rightSlot}
      </div>

      {/* Right: compact user info (mobile) */}
      <div className="lg:hidden flex items-center gap-2 ml-auto">
        {rightSlot}
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="mobile-menu lg:hidden">
          <nav className="mobile-menu-nav">
            <Link 
              href="/" 
              className="mobile-menu-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="/info" 
              className="mobile-menu-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              Info
            </Link>
            <Link 
              href="/features" 
              className="mobile-menu-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </Link>
            {isAuthenticated && (
              <>
                <Link 
                  href="/dashboard" 
                  className="mobile-menu-link"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link 
                  href="/leaderboard" 
                  className="mobile-menu-link"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Leaderboard
                </Link>
                <Link 
                  href="/friends" 
                  className="mobile-menu-link"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Friends
                </Link>
                <Link 
                  href="/dashboard/profile" 
                  className="mobile-menu-link"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
