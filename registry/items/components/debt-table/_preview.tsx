"use client";

import { useState } from "react";

import { DebtTable, type DebtTableRow } from "./debt-table";

const rows: DebtTableRow[] = [
  {
    id: "1",
    name: "Ana Souza",
    account: "100240",
    pa: "01",
    invoiceBill: 1800,
    delayedDays: 55,
  },
  {
    id: "2",
    name: "Bruno Lima",
    account: "100241",
    pa: "02",
    invoiceBill: 4520,
    delayedDays: 8,
  },
  {
    id: "3",
    name: "Carla Nunes",
    account: "100242",
    pa: "03",
    invoiceBill: 7240,
    delayedDays: 3,
  },
  {
    id: "4",
    name: "Diego Alves",
    account: "100243",
    pa: "04",
    invoiceBill: 9960,
    delayedDays: 12,
  },
  {
    id: "5",
    name: "Elena Prado",
    account: "100244",
    pa: "05",
    invoiceBill: 12680,
    delayedDays: 111,
  },
];

export function Preview() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="flex w-full flex-col gap-3">
      <DebtTable rows={rows} onRowClick={(row) => setSelected(row.name)} />
      {selected ? (
        <p className="text-sm text-muted-foreground">Linha selecionada: {selected}</p>
      ) : null}
    </div>
  );
}
