import type { ReactNode } from 'react';
import Link from 'next/link';

type HeaderProps = {
  rightSlot?: ReactNode;
};

export function Header({ rightSlot }: HeaderProps) {
  return (
    <header className="border-b border-slate-800 px-4 h-16 flex items-center justify-between gap-4">
      {/* Left: main nav */}
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
      </nav>

      {/* Center: clickable title */}
      <Link
        href="/"
        className="font-semibold tracking-tight text-base text-white absolute left-1/2 -translate-x-1/2"
      >
        Ski Tracker
      </Link>

      {/* Right: auth actions or user info, provided by caller */}
      <div className="flex items-center gap-3 ml-auto">
        {rightSlot}
      </div>
    </header>
  );
}
