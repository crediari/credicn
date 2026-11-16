"use client";

import { PolarAngleAxis, RadialBar, RadialBarChart } from "recharts";

import { ChartContainer } from "@/components/ui/chart";

import { StatisticCard, type StatisticCardProps } from "../statistic-card/statistic-card";

type StatisticGoalCardProps = Omit<StatisticCardProps, "value" | "children"> & {
  current: number;
  target: number;
  value?: StatisticCardProps["value"];
  formatValue?: (value: number) => string;
  targetLabel?: string;
  color?: string;
  emptyMessage?: string;
};

function StatisticGoalCard({
  current,
  target,
  value,
  formatValue = (amount) => amount.toLocaleString("pt-BR"),
  targetLabel = "Meta",
  color = "var(--chart-1)",
  emptyMessage = "Defina uma meta maior que zero.",
  ...props
}: StatisticGoalCardProps) {
  const isValid = Number.isFinite(current) && Number.isFinite(target) && target > 0;
  const percentage = isValid ? Math.max(0, (current / target) * 100) : 0;
  const progress = Math.min(100, percentage);

  return (
    <StatisticCard
      value={value ?? (Number.isFinite(current) ? formatValue(current) : "—")}
      {...props}
    >
      {isValid ? (
        <>
          <div
            className="relative mx-auto size-44"
            role="meter"
            aria-label={props.title}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
            aria-valuetext={`${Math.round(percentage)}% da meta`}
          >
            <ChartContainer
              config={{ progress: { label: targetLabel, color } }}
              className="aspect-square size-full"
              aria-hidden="true"
            >
              <RadialBarChart
                data={[{ progress }]}
                startAngle={90}
                endAngle={-270}
                innerRadius="78%"
                outerRadius="100%"
                barSize={12}
              >
                <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                <RadialBar
                  dataKey="progress"
                  background
                  cornerRadius={12}
                  fill="var(--color-progress)"
                  isAnimationActive={false}
                />
              </RadialBarChart>
            </ChartContainer>
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-1"
            >
              <span className="text-3xl font-semibold tracking-tight tabular-nums">
                {Math.round(percentage)}%
              </span>
              <span className="text-xs text-muted-foreground">da meta</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 border-t pt-4 text-xs">
            <span className="text-muted-foreground">{targetLabel}</span>
            <span className="font-medium tabular-nums">{formatValue(target)}</span>
          </div>
        </>
      ) : (
        <p
          role="status"
          className="flex h-44 items-center justify-center text-center text-sm text-muted-foreground"
        >
          {emptyMessage}
        </p>
      )}
    </StatisticCard>
  );
}

export { StatisticGoalCard, type StatisticGoalCardProps };
