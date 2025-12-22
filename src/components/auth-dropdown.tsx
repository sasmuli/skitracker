"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { LogIn, UserPlus, User } from "lucide-react";

export function AuthDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative profile-dropdown-toggle">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="btn btn-secondary p-2"
        aria-label="Account menu"
      >
        <User className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="profile-dropdown-menu">
          <Link
            href="/login"
            className="btn btn-primary"
            onClick={() => setIsOpen(false)}
          >
            <LogIn className="w-4 h-4" />
            Log in
          </Link>
          <Link
            href="/signup"
            className="btn btn-secondary"
            onClick={() => setIsOpen(false)}
          >
            <UserPlus className="w-4 h-4" />
            Sign up
          </Link>
        </div>
      )}
    </div>
  );
}
