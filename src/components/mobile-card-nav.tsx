'use client';

import type { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase/browser-client';
import { LogOut, LogIn, UserPlus, User } from 'lucide-react';
import CardNav, { CardNavItem } from './card-nav';

const NAV_ITEMS_PUBLIC: CardNavItem[] = [
  {
    label: "Navigate",
    bgColor: "rgba(39, 39, 39, 0.6)",
    textColor: "#fff",
    links: [
      { label: "Home", href: "/", ariaLabel: "Go to Home" },
      { label: "Info", href: "/info", ariaLabel: "Go to Info" },
      { label: "Features", href: "/features", ariaLabel: "Go to Features" },
    ]
  },
  {
    label: "Account",
    bgColor: "rgba(39, 39, 39, 0.6)",
    textColor: "#fff",
    links: [
      { label: "Log in", href: "/login", ariaLabel: "Log in", icon: LogIn },
      { label: "Sign up", href: "/signup", ariaLabel: "Sign up", icon: UserPlus },
    ]
  },
];

type MobileCardNavProps = {
  rightSlot?: ReactNode;
  isAuthenticated?: boolean;
  isUserAdmin?: boolean;
};

export function MobileCardNav({ rightSlot, isAuthenticated = false, isUserAdmin = false }: MobileCardNavProps) {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  const navItemsAuth: CardNavItem[] = [
    {
      label: "Navigate",
      bgColor: "rgba(39, 39, 39, 0.6)",
      textColor: "#fff",
      links: [
        { label: "Home", href: "/", ariaLabel: "Go to Home" },
        { label: "Dashboard", href: "/dashboard", ariaLabel: "Go to Dashboard" },
        ...(isUserAdmin ? [{ label: "Admin", href: "/adminDashboard", ariaLabel: "Go to Admin Dashboard" }] : []),
      ]
    },
    {
      label: "Social",
      bgColor: "rgba(39, 39, 39, 0.6)",
      textColor: "#fff",
      links: [
        { label: "Leaderboard", href: "/leaderboard", ariaLabel: "Go to Leaderboard" },
        { label: "Friends", href: "/friends", ariaLabel: "Go to Friends" },
      ]
    },
    {
      label: "More",
      bgColor: "rgba(39, 39, 39, 0.6)",
      textColor: "#fff",
      links: [
        { label: "Info", href: "/info", ariaLabel: "Go to Info" },
        { label: "Features", href: "/features", ariaLabel: "Go to Features" },
      ]
    },
    {
      label: "Account",
      bgColor: "rgba(39, 39, 39, 0.6)",
      textColor: "#fff",
      links: [
        { label: "Profile", href: "/dashboard/profile", ariaLabel: "Go to Profile", icon: User },
        { label: "Log Out", href: "#", ariaLabel: "Log out", icon: LogOut, onClick: handleLogout },
      ]
    }
  ];

  const navItems = isAuthenticated ? navItemsAuth : NAV_ITEMS_PUBLIC;

  return (
    <CardNav
      logo="/logo_ski_tracker_2.png"
      logoAlt="Ski Tracker"
      items={navItems}
      rightSlot={rightSlot}
      className="mobile-card-nav"
    />
  );
}