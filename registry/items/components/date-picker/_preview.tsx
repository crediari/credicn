"use client";

import { useState } from "react";
import type { DateRange } from "react-day-picker";

import { DatePicker } from "./date-picker";

export function Preview() {
  const [date, setDate] = useState<Date | undefined>();
  const [period, setPeriod] = useState<DateRange | undefined>();

  return (
    <div className="grid w-full max-w-md gap-6">
      <div className="grid gap-2">
        <span className="text-sm font-medium">Data</span>
        <DatePicker value={date} onChange={setDate} />
      </div>

      <div className="grid gap-2">
        <span className="text-sm font-medium">Período</span>
        <DatePicker type="range" value={period} onChange={setPeriod} />
      </div>
    </div>
  );
}
