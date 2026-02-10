"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

interface DeclineDialogProps {
  resortName: string;
  isOpen: boolean;
  onConfirm: (message: string) => void;
  onCancel: () => void;
}

export function DeclineDialog({ resortName, isOpen, onConfirm, onCancel }: DeclineDialogProps) {
  const [mounted, setMounted] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setMessage("");
    }
  }, [isOpen]);

  const handleSend = () => {
    onConfirm(message.trim());
  };

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div className="ski-info-overlay" onClick={onCancel}>
      <div
        className="ski-info-dialog"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="ski-info-header">
          <h3 className="ski-info-title">Decline Resort</h3>
          <button
            type="button"
            onClick={onCancel}
            className="ski-info-close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="ski-info-content">
          <p className="text-sm text-[var(--color-text-muted)] mb-4">
            You are about to decline <span className="font-semibold text-[var(--foreground)]">{resortName}</span>.
            Please provide a reason for the decline.
          </p>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write why this resort is being declined..."
            className="w-full min-h-[120px] px-3 py-2 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg text-[var(--foreground)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--accent)] resize-none"
            autoFocus
          />
          <div className="flex gap-3 mt-4">
            <button
              onClick={onCancel}
              className="btn btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              onClick={handleSend}
              className="btn btn-primary flex-1"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
