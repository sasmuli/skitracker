import type { ReactNode } from 'react';
import Link from 'next/link';
import { Header } from '@/components/header';

export default function SignupLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Header
        rightSlot={
          <Link
            href="/"
            className="text-sm px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-md border border-slate-600"
          >
            Home
          </Link>
        }
      />
      <main className="min-h-[calc(100vh-60px)] px-4 py-6 flex items-center justify-center">
        {children}
      </main>
    </div>
  );
}
