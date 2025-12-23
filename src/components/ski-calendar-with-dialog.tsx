"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { SkiCalendar } from "./ski-calendar";
import { SkiDayDialog } from "./ski-day-dialog";
import { deleteSkiDay, updateSkiDay } from "@/lib/actions";
import type { SkiDay, ResortOption, UpdateSkiDayInput } from "@/types";

type SkiCalendarWithDialogProps = {
  skiDays: SkiDay[];
  resorts: ResortOption[];
};

export function SkiCalendarWithDialog({
  skiDays,
  resorts,
}: SkiCalendarWithDialogProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selectedSkiDay, setSelectedSkiDay] = useState<SkiDay | null>(null);
  const [pendingClose, setPendingClose] = useState(false);

  // Create a map for quick lookup
  const skiDayMap = new Map<string, SkiDay>();
  skiDays.forEach((day) => {
    skiDayMap.set(day.date, day);
  });

  function handleDayClick(dateString: string) {
    console.log(`${dateString} pressed`);
    const skiDay = skiDayMap.get(dateString);
    if (skiDay) {
      setSelectedSkiDay(skiDay);
    }
  }

  function handleCloseDialog() {
    setSelectedSkiDay(null);
  }

  async function handleDelete(id: string) {
    const result = await deleteSkiDay(id);
    if (result.success) {
      setPendingClose(true);
      startTransition(() => {
        router.refresh();
      });
    }
  }

  async function handleEdit(input: UpdateSkiDayInput) {
    const result = await updateSkiDay(input);
    if (result.success) {
      setPendingClose(true);
      startTransition(() => {
        router.refresh();
      });
    }
  }

  // Close dialog when refresh completes
  if (pendingClose && !isPending) {
    setPendingClose(false);
    setSelectedSkiDay(null);
  }

  return (
    <>
      <SkiCalendar skiDays={skiDays} onDayClick={handleDayClick} />
      <SkiDayDialog
        skiDay={selectedSkiDay}
        resorts={resorts}
        onClose={handleCloseDialog}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />
    </>
  );
}
