import type { ReactNode } from 'react';
import { Header } from '@/components/header';

export default function OnboardingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="page-container">
      <Header />
      <main className="page-center">
        {children}
      </main>
    </div>
  );
}
