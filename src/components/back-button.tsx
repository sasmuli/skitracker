"use client";

import { useRouter } from "next/navigation";

export function BackButton({ className, children }: { className?: string; children: React.ReactNode }) {
  const router = useRouter();
  return (
    <button type="button" className={className} onClick={() => router.back()}>
      {children}
    </button>
  );
}
