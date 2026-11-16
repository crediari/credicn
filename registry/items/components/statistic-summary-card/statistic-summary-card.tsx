"use client";

import type { ComponentProps } from "react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import { StatisticCard, type StatisticCardProps } from "../statistic-card/statistic-card";

type StatisticSummaryItem = Pick<
  StatisticCardProps,
  "title" | "value" | "description" | "icon" | "trend"
> & { id: string };
type StatisticSummaryCardProps = ComponentProps<typeof Card> & {
  items: readonly StatisticSummaryItem[];
  columns?: 2 | 3 | 4;
};

function StatisticSummaryCard({
  items,
  columns = 4,
  className,
  ...props
}: StatisticSummaryCardProps) {
  return (
    <Card className={cn("gap-0 py-0", className)} {...props}>
      <div
        className={cn(
          "grid grid-cols-1 gap-px bg-border/50",
          columns === 2 && "sm:grid-cols-2",
          columns === 3 && "sm:grid-cols-3",
          columns === 4 && "sm:grid-cols-2 xl:grid-cols-4",
        )}
      >
        {items.map(({ id, ...item }) => (
          <StatisticCard
            key={id}
            {...item}
            layout="compact"
            className="h-full rounded-none shadow-none ring-0 [&_[data-slot=card-header]]:min-h-10"
          />
        ))}
      </div>
    </Card>
  );
}

export { StatisticSummaryCard, type StatisticSummaryCardProps, type StatisticSummaryItem };
