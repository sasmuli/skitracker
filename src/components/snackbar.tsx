"use client";

export type SnackbarType = "success" | "error";

export function Snackbar({
  type,
  message,
  onClose,
}: {
  type: SnackbarType;
  message: string;
  onClose: () => void;
}) {
  const label = type === "success" ? "Success:" : "Error:";
  const labelClass =
    type === "success"
      ? "text-[var(--color-success)]"
      : "text-[var(--color-error)]";

  return (
    <div className="fixed left-1/2 top-4 z-[9999] w-[calc(100%-2rem)] max-w-md -translate-x-1/2">
      <div className="glass px-4 py-3">
        <div className="flex items-start justify-between gap-3">
          <p className="text-sm leading-snug text-[var(--color-text)]">
            <span className={`font-semibold ${labelClass}`}>{label}</span>{" "}
            {message}
          </p>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="ml-2 inline-flex h-7 w-7 items-center justify-center rounded-md text-[var(--color-text-muted)] hover:bg-white/5 hover:text-[var(--accent)]"
          >
            <span className="text-base leading-none">×</span>
          </button>
        </div>
      </div>
    </div>
  );
}
