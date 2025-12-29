import type { ReactNode } from "react";
import { Header } from "@/components/header";
import { MobileCardNav } from "@/components/mobile-card-nav";
import { FloatingLinesBackground } from "@/components/floatinglines-backgorund";

export default function SignupLayout({ children }: { children: ReactNode }) {
  return (
    <div className="page-container">
      <FloatingLinesBackground />
      <MobileCardNav isAuthenticated={false} />
      <Header />
      <main className="page-center">{children}</main>
    </div>
  );
}
