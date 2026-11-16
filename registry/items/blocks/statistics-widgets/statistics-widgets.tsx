"use client";

import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

import {
  StatisticBreakdownCard,
  type StatisticBreakdownCardProps,
} from "../../components/statistic-breakdown-card/statistic-breakdown-card";
import {
  StatisticChartCard,
  type StatisticChartCardProps,
} from "../../components/statistic-chart-card/statistic-chart-card";
import {
  StatisticProgressCard,
  type StatisticProgressCardProps,
} from "../../components/statistic-progress-card/statistic-progress-card";

type StatisticsWidgetsProps = ComponentProps<"div"> & {
  customers: StatisticChartCardProps;
  products: StatisticBreakdownCardProps;
  deal: StatisticProgressCardProps;
  payments: StatisticChartCardProps;
};

function StatisticsWidgets({
  customers,
  products,
  deal,
  payments,
  className,
  ...props
}: StatisticsWidgetsProps) {
  return (
    <div
      className={cn(
        "grid w-full grid-cols-[repeat(auto-fit,minmax(min(100%,16rem),1fr))] gap-4",
        className,
      )}
      {...props}
    >
      <StatisticChartCard layout="inline" chartStyle="sparkline" {...customers} />
      <StatisticBreakdownCard layout="inline" showLegend={false} {...products} />
      <StatisticProgressCard layout="inline" {...deal} />
      <StatisticChartCard
        layout="inline"
        chartStyle="sparkline"
        chartType="bar"
        stacked
        showLegend
        {...payments}
      />
    </div>
  );
}

export { StatisticsWidgets, type StatisticsWidgetsProps };
