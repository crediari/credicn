"use client";

import { useId } from "react";
import { Area, Bar, CartesianGrid, ComposedChart, Line, XAxis } from "recharts";

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import { StatisticCard, type StatisticCardProps } from "../statistic-card/statistic-card";

type StatisticChartPoint = { label: string; value: number; comparison?: number };
type StatisticChartCardProps = Omit<StatisticCardProps, "children"> & {
  data: readonly StatisticChartPoint[];
  chartType?: "area" | "line" | "bar";
  chartStyle?: "default" | "sparkline";
  stacked?: boolean;
  showLegend?: boolean;
  color?: string;
  comparisonColor?: string;
  valueLabel?: string;
  comparisonLabel?: string;
  formatValue?: (value: number) => string;
  emptyMessage?: string;
};

function StatisticChartCard({
  data,
  chartType = "area",
  chartStyle = "default",
  stacked = false,
  showLegend,
  color = "var(--chart-1)",
  comparisonColor = "var(--chart-2)",
  valueLabel = "Atual",
  comparisonLabel = "Anterior",
  formatValue = (value) => value.toLocaleString("pt-BR"),
  emptyMessage = "Nenhum dado neste período.",
  ...props
}: StatisticChartCardProps) {
  const gradientId = `statistic-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const hasComparison = data.some((point) => point.comparison !== undefined);
  const series = [
    { key: "value", label: valueLabel, color },
    ...(hasComparison
      ? [{ key: "comparison", label: comparisonLabel, color: comparisonColor }]
      : []),
  ];
  const sparkline = chartStyle === "sparkline";
  const legendVisible = showLegend ?? (hasComparison && !sparkline);
  const config = Object.fromEntries(
    series.map((item) => [item.key, { label: item.label, color: item.color }]),
  );

  return (
    <StatisticCard {...props}>
      {data.length === 0 ? (
        <p
          className="flex h-44 items-center justify-center text-sm text-muted-foreground"
          role="status"
        >
          {emptyMessage}
        </p>
      ) : (
        <ChartContainer
          config={config}
          className={sparkline ? "aspect-auto h-24 w-full" : "aspect-auto h-44 w-full"}
          aria-label={`Evolução de ${props.title}`}
        >
          <ComposedChart
            accessibilityLayer
            data={[...data]}
            margin={{ top: 8, right: 8, left: 8, bottom: 0 }}
          >
            <defs>
              {series.map((item) => (
                <linearGradient
                  key={item.key}
                  id={`${gradientId}-${item.key}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor={`var(--color-${item.key})`} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={`var(--color-${item.key})`} stopOpacity={0.02} />
                </linearGradient>
              ))}
            </defs>
            {!sparkline && <CartesianGrid vertical={false} strokeDasharray="3 3" />}
            <XAxis
              hide={sparkline}
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              minTickGap={20}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, name) => (
                    <>
                      <span className="text-muted-foreground">
                        {name === "value" ? valueLabel : comparisonLabel}
                      </span>
                      <span className="ml-auto font-medium tabular-nums">
                        {formatValue(Number(value))}
                      </span>
                    </>
                  )}
                />
              }
            />
            {legendVisible && <ChartLegend content={<ChartLegendContent />} />}
            {series.map((item) =>
              chartType === "bar" ? (
                <Bar
                  key={item.key}
                  dataKey={item.key}
                  stackId={stacked ? "total" : undefined}
                  fill={`var(--color-${item.key})`}
                  radius={[4, 4, 0, 0]}
                  maxBarSize={32}
                  isAnimationActive={false}
                />
              ) : chartType === "line" ? (
                <Line
                  key={item.key}
                  dataKey={item.key}
                  type="monotone"
                  stroke={`var(--color-${item.key})`}
                  strokeWidth={2}
                  dot={false}
                  strokeDasharray={item.key === "comparison" ? "4 4" : undefined}
                  isAnimationActive={false}
                />
              ) : (
                <Area
                  key={item.key}
                  dataKey={item.key}
                  type="monotone"
                  stroke={`var(--color-${item.key})`}
                  strokeWidth={2}
                  fill={`url(#${gradientId}-${item.key})`}
                  isAnimationActive={false}
                />
              ),
            )}
          </ComposedChart>
        </ChartContainer>
      )}
    </StatisticCard>
  );
}

export { StatisticChartCard, type StatisticChartCardProps, type StatisticChartPoint };
