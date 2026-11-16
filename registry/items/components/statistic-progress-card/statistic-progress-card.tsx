"use client";

import { Bar, BarChart, XAxis, YAxis } from "recharts";

import { ChartContainer } from "@/components/ui/chart";

import { StatisticCard, type StatisticCardProps } from "../statistic-card/statistic-card";

type StatisticProgressCardProps = StatisticCardProps & {
  current: number;
  target: number;
  currentLabel?: string;
  targetLabel?: string;
  color?: string;
  formatValue?: (value: number) => string;
  emptyMessage?: string;
};

function StatisticProgressCard({
  current,
  target,
  currentLabel = "Realizado",
  targetLabel = "Meta",
  color = "var(--chart-1)",
  formatValue = (amount) => amount.toLocaleString("pt-BR"),
  emptyMessage = "Defina uma meta maior que zero.",
  value,
  children,
  ...props
}: StatisticProgressCardProps) {
  const valid = Number.isFinite(current) && Number.isFinite(target) && target > 0;
  const percentage = valid ? Math.max(0, (current / target) * 100) : 0;
  const progress = Math.min(100, percentage);
  return (
    <StatisticCard value={value ?? (valid ? `${Math.round(percentage)}%` : "—")} {...props}>
      {valid ? (
        <div className="space-y-3">
          <div className="flex justify-between gap-3 text-sm font-semibold tabular-nums">
            <span>
              <span className="sr-only">{currentLabel}: </span>
              {formatValue(current)}
            </span>
            <span>
              <span className="sr-only">{targetLabel}: </span>
              {formatValue(target)}
            </span>
          </div>
          <div
            role="meter"
            aria-label={props.title}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
            aria-valuetext={`${Math.round(percentage)}% da meta`}
          >
            <ChartContainer
              config={{ progress: { label: currentLabel, color } }}
              className="aspect-auto h-3 w-full"
              aria-hidden="true"
            >
              <BarChart
                layout="vertical"
                data={[{ progress }]}
                margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
              >
                <XAxis type="number" domain={[0, 100]} hide />
                <YAxis type="category" hide />
                <Bar
                  dataKey="progress"
                  barSize={6}
                  radius={3}
                  background={{ fill: "var(--muted)", radius: 3 }}
                  fill="var(--color-progress)"
                  isAnimationActive={false}
                />
              </BarChart>
            </ChartContainer>
          </div>
          <div className="flex justify-between gap-3 text-xs text-muted-foreground">
            <span>{currentLabel}</span>
            <span>{targetLabel}</span>
          </div>
        </div>
      ) : (
        <p role="status" className="text-sm text-muted-foreground">
          {emptyMessage}
        </p>
      )}
      {children}
    </StatisticCard>
  );
}

export { StatisticProgressCard, type StatisticProgressCardProps };
