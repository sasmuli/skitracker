"use client";

import { X } from "lucide-react";
import { useState } from "react";
import { Snackbar, SnackbarType } from "./snackbar";
import { sendContactMessage } from "@/lib/api/contact";

type ContactFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
};

export function ContactFormModal({ isOpen, onClose, title }: ContactFormModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [snackbar, setSnackbar] = useState<{ type: SnackbarType; message: string } | null>(null);

  if (!isOpen) return null;

  const handleSend = async () => {
    if (!email || !message) {
      setError("Email and message are required");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await sendContactMessage({
        name,
        email,
        message,
        type: title,
      });

      setSnackbar({ type: "success", message: "Message sent successfully!" });
      setTimeout(() => {
        setName("");
        setEmail("");
        setMessage("");
        setError("");
        onClose();
      }, 1500);
    } catch (err) {
      setSnackbar({ type: "error", message: "Failed to send message. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setName("");
    setEmail("");
    setMessage("");
    setError("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleCancel}
      />
      
      <div className="relative w-full max-w-md glass-card rounded-lg border border-[rgba(255,255,255,0.1)] p-6">
        <button
          onClick={handleCancel}
          className="absolute top-4 right-4 text-[var(--color-text-muted)] hover:text-[var(--foreground)] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">
          {title}
        </h2>

        <div className="space-y-4">
          <div>
            <label 
              htmlFor="contact-title" 
              className="block text-sm font-medium text-[var(--foreground)] mb-2"
            >
              Type
            </label>
            <input
              id="contact-title"
              type="text"
              value={title}
              disabled
              className="w-full px-4 py-2 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg text-[var(--color-text-muted)] cursor-not-allowed"
            />
          </div>

          <div>
            <label 
              htmlFor="contact-name" 
              className="block text-sm font-medium text-[var(--foreground)] mb-2"
            >
              Name <span className="text-[var(--color-text-muted)] text-xs">(optional)</span>
            </label>
            <input
              id="contact-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full px-4 py-2 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg text-[var(--foreground)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--accent)] transition-colors"
            />
          </div>

          <div>
            <label 
              htmlFor="contact-email" 
              className="block text-sm font-medium text-[var(--foreground)] mb-2"
            >
              Email <span className="text-red-400">*</span>
            </label>
            <input
              id="contact-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="w-full px-4 py-2 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg text-[var(--foreground)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--accent)] transition-colors"
            />
          </div>

          <div>
            <label 
              htmlFor="contact-message" 
              className="block text-sm font-medium text-[var(--foreground)] mb-2"
            >
              Message <span className="text-red-400">*</span>
            </label>
            <textarea
              id="contact-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
              placeholder="Describe your bug report or feature request..."
              required
              className="w-full px-4 py-2 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg text-[var(--foreground)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--accent)] transition-colors resize-none"
            />
          </div>

          {error && (
            <div className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleCancel}
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.1)] rounded-lg text-[var(--foreground)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleSend}
              disabled={!email.trim() || !message.trim() || isLoading}
              className="flex-1 px-4 py-2 bg-[var(--accent)] hover:bg-[var(--accent-hover)] rounded-lg text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Sending..." : "Send"}
            </button>
          </div>
        </div>
      </div>

      {snackbar && (
        <Snackbar
          type={snackbar.type}
          message={snackbar.message}
          onClose={() => setSnackbar(null)}
        />
      )}
    </div>
  );
}
