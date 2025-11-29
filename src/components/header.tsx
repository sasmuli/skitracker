import type { ReactNode } from 'react';

type HeaderProps = {
  rightSlot?: ReactNode;
};

export function Header({ rightSlot }: HeaderProps) {
  return (
    <header className="border-b border-slate-800 px-4 py-3 flex items-center justify-between">
      <span className="font-semibold tracking-tight">Ski Tracker</span>

      <div className="flex items-center gap-3">
        {rightSlot}
      </div>
    </header>
  );
}
