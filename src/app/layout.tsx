import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Ski Tracker',
  description: 'Track your ski adventures',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
