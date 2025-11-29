import type { ReactNode } from 'react';
import { Header } from '@/components/header';

export default function SignupLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Header />
      <main className="min-h-[calc(100vh-60px)] px-4 py-6 flex items-center justify-center">
        {children}
      </main>
    </div>
  );
}
