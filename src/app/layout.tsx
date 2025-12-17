import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Ski Tracker',
  description: 'Track your ski adventures',
  icons: {
    icon: '/favicon_ski_tracker_3.png',
    apple: '/favicon_ski_tracker_3.png',
  },
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
