'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

type HeaderProps = {
  rightSlot?: ReactNode;
};

export function Header({ rightSlot }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="glass-header px-4 h-16 flex items-center justify-between gap-4 relative">
      {/* Mobile menu button */}
      <button
        type="button"
        className="md:hidden p-2 -ml-2 text-slate-300 hover:text-white"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Left: main nav (desktop) */}
      <nav className="hidden md:flex items-center gap-4 text-sm text-slate-300">
        <Link href="/" className="hover:text-white">
          Home
        </Link>
        <Link href="/info" className="hover:text-white">
          Info
        </Link>
        <Link href="/features" className="hover:text-white">
          Features
        </Link>
      </nav>

      {/* Center: clickable title */}
      <Link
        href="/"
        className="font-semibold tracking-tight text-base text-white md:absolute md:left-1/2 md:-translate-x-1/2"
      >
        Ski Tracker
      </Link>

      {/* Right: auth actions or user info (desktop) */}
      <div className="hidden md:flex items-center gap-3 ml-auto">
        {rightSlot}
      </div>

      {/* Right: compact user info (mobile) */}
      <div className="md:hidden flex items-center gap-2 ml-auto">
        {rightSlot}
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-slate-900/95 border-b border-slate-700 md:hidden z-50">
          <nav className="flex flex-col p-4 gap-3 text-sm text-slate-300">
            <Link 
              href="/" 
              className="hover:text-white py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="/info" 
              className="hover:text-white py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Info
            </Link>
            <Link 
              href="/features" 
              className="hover:text-white py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
