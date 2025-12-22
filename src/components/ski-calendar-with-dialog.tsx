"use client";

import { useState } from "react";
import { SkiCalendar } from "./ski-calendar";
import { SkiDayDialog } from "./ski-day-dialog";
import type { SkiDay } from "@/types";

type SkiCalendarWithDialogProps = {
  skiDays: SkiDay[];
};

export function SkiCalendarWithDialog({ skiDays }: SkiCalendarWithDialogProps) {
  const [selectedSkiDay, setSelectedSkiDay] = useState<SkiDay | null>(null);

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

  return (
    <>
      <SkiCalendar skiDays={skiDays} onDayClick={handleDayClick} />
      <SkiDayDialog skiDay={selectedSkiDay} onClose={handleCloseDialog} />
    </>
  );
}
