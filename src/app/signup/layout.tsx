import type { ReactNode } from "react";
import { Header } from "@/components/header";
import { FloatingLinesBackground } from "@/components/floatinglines-backgorund";

export default function SignupLayout({ children }: { children: ReactNode }) {
  return (
    <div className="page-container">
      <FloatingLinesBackground />
      <Header />
      <main className="page-center">{children}</main>
    </div>
  );
}
