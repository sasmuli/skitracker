"use client";

import { useEffect, useState } from "react";
import AnimatedList from "@/components/animated-list";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser-client";
import { getUnapprovedResorts } from "@/lib/queries/resorts";
import { approveResort, declineResort } from "@/lib/actions/resorts";
import type { Resort } from "@/types";
import { Check, X, Loader2 } from "lucide-react";
import { Snackbar, type SnackbarType } from "@/components/snackbar";
import { DeclineDialog } from "@/components/decline-dialog";

export default function AdminDashboard() {
  const [unapprovedResorts, setUnapprovedResorts] = useState<Resort[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{ type: SnackbarType; message: string } | null>(null);
  const [declineDialogOpen, setDeclineDialogOpen] = useState(false);
  const [selectedResort, setSelectedResort] = useState<Resort | null>(null);

  useEffect(() => {
    async function fetchResorts() {
      const supabase = createSupabaseBrowserClient();
      const resorts = await getUnapprovedResorts(supabase);
      setUnapprovedResorts(resorts);
      setLoading(false);
    }
    fetchResorts();
  }, []);

  const handleApprove = async (resortId: string) => {
    setProcessingId(resortId);
    try {
      const result = await approveResort(resortId);
      if (result.success) {
        setUnapprovedResorts(prev => prev.filter(r => r.id !== resortId));
        setSnackbar({ type: "success", message: "Resort approved successfully!" });
        setTimeout(() => setSnackbar(null), 3000);
      } else {
        setSnackbar({ type: "error", message: result.error || "Failed to approve resort" });
        setTimeout(() => setSnackbar(null), 3000);
      }
    } catch (error) {
      setSnackbar({ type: "error", message: "An error occurred while approving" });
      setTimeout(() => setSnackbar(null), 3000);
    } finally {
      setProcessingId(null);
    }
  };

  const openDeclineDialog = (resort: Resort) => {
    setSelectedResort(resort);
    setDeclineDialogOpen(true);
  };

  const handleDeclineConfirm = async (message: string) => {
    if (!selectedResort) return;
    
    setDeclineDialogOpen(false);
    setProcessingId(selectedResort.id);
    
    try {
      const result = await declineResort(selectedResort.id, message);
      if (result.success) {
        setUnapprovedResorts(prev => prev.filter(r => r.id !== selectedResort.id));
        setSnackbar({ type: "success", message: "Resort declined and notification sent!" });
        setTimeout(() => setSnackbar(null), 3000);
      } else {
        setSnackbar({ type: "error", message: result.error || "Failed to decline resort" });
        setTimeout(() => setSnackbar(null), 3000);
      }
    } catch (error) {
      setSnackbar({ type: "error", message: "An error occurred while declining" });
      setTimeout(() => setSnackbar(null), 3000);
    } finally {
      setProcessingId(null);
      setSelectedResort(null);
    }
  };

  return (
    <>
      {snackbar && (
        <Snackbar
          type={snackbar.type}
          message={snackbar.message}
          onClose={() => setSnackbar(null)}
        />
      )}
      <div className="mx-auto w-full max-w-3xl px-4 sm:px-0">
        <header className="mb-4">
          <h1 className="text-3xl font-semibold text-center text-[var(--foreground)]">
            Admin Dashboard
          </h1>
          <p className="mt-2 text-center text-sm text-[var(--color-text-muted)]">
            Review and manage pending resort submissions.
          </p>
        </header>

        <section>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-6">
            <div>
              <h2 className="text-xl font-semibold text-[var(--foreground)]">
                Pending Resorts
              </h2>
              <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                {unapprovedResorts.length} resort{unapprovedResorts.length !== 1 ? 's' : ''} awaiting approval.
              </p>
            </div>
          </div>

          {unapprovedResorts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <p className="text-lg text-[var(--color-text-muted)]">
                No resorts to approve
              </p>
              <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                All resort submissions have been reviewed.
              </p>
            </div>
          ) : (
            <AnimatedList
              items={unapprovedResorts.map((r) => r.name)}
              showGradients={false}
              enableArrowNavigation
              displayScrollbar
              renderItem={(item, index) => {
                const resort = unapprovedResorts[index];
                return (
                  <div className="animated-list-item relative p-4 border border-[rgba(255,255,255,0.1)] rounded-lg bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.08)] transition-colors">
                    <div className="flex items-start justify-between gap-8">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">
                          {resort.name}
                        </h3>
                        <div className="grid grid-cols-2 gap-2 text-sm text-[var(--color-text-muted)]">
                          <div>
                            <span className="font-medium">Location:</span> {resort.location_city}, {resort.location_country}
                          </div>
                          <div>
                            <span className="font-medium">Height:</span> {resort.height_m}m
                          </div>
                          <div>
                            <span className="font-medium">Lifts:</span> {resort.lifts}
                          </div>
                          <div>
                            <span className="font-medium">Slopes:</span> {resort.skislopes_km}km
                          </div>
                        </div>
                      </div>
                      <div className="absolute bottom-4 right-4 flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleApprove(resort.id);
                          }}
                          className="btn btn-secondary"
                          title="Approve"
                          aria-label="Approve"
                          disabled={processingId === resort.id}
                        >
                          {processingId === resort.id ? (
                            <Loader2 className="w-5 h-5 animate-spin" style={{ color: "var(--color-success)" }} />
                          ) : (
                            <Check className="w-5 h-5" style={{ color: "var(--color-success)" }} />
                          )}
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openDeclineDialog(resort);
                          }}
                          className="btn btn-secondary"
                          title="Decline"
                          aria-label="Decline"
                          disabled={processingId === resort.id}
                        >
                          {processingId === resort.id ? (
                            <Loader2 className="w-5 h-5 animate-spin" style={{ color: "var(--color-error)" }} />
                          ) : (
                            <X className="w-5 h-5" style={{ color: "var(--color-error)" }} />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              }}
            />
          )}
        </section>
      </div>

      <DeclineDialog
        resortName={selectedResort?.name || ""}
        isOpen={declineDialogOpen}
        onConfirm={handleDeclineConfirm}
        onCancel={() => {
          setDeclineDialogOpen(false);
          setSelectedResort(null);
        }}
      />
    </>
  );
}