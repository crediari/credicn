"use client";

import { PolarAngleAxis, RadialBar, RadialBarChart } from "recharts";

import { ChartContainer } from "@/components/ui/chart";

import { StatisticCard, type StatisticCardProps } from "../statistic-card/statistic-card";

type StatisticRingItem = {
  id: string;
  label: string;
  current: number;
  target: number;
  color?: string;
};
type StatisticRingCardProps = Omit<StatisticCardProps, "children"> & {
  data: readonly StatisticRingItem[];
  showLegend?: boolean;
  showScale?: boolean;
  formatValue?: (value: number) => string;
  emptyMessage?: string;
};

function StatisticRingCard({
  data,
  showLegend = true,
  showScale = false,
  formatValue = (amount) => amount.toLocaleString("pt-BR"),
  emptyMessage = "Nenhuma meta válida neste período.",
  ...props
}: StatisticRingCardProps) {
  const rings = data.flatMap((item, index) => {
    if (!Number.isFinite(item.current) || !Number.isFinite(item.target) || item.target <= 0)
      return [];
    const percentage = Math.max(0, (item.current / item.target) * 100);
    return [
      {
        ...item,
        percentage,
        progress: Math.min(100, percentage),
        fill: item.color ?? `var(--chart-${(index % 5) + 1})`,
      },
    ];
  });
  return (
    <StatisticCard {...props}>
      {rings.length > 0 ? (
        <>
          <div className="relative mx-auto size-60 max-w-full p-4">
            <ChartContainer
              config={{ progress: { label: "Progresso" } }}
              className="aspect-square size-full"
              aria-label={`Metas de ${props.title}`}
            >
              <RadialBarChart
                data={rings}
                startAngle={90}
                endAngle={-270}
                innerRadius="32%"
                outerRadius="100%"
                barCategoryGap="20%"
              >
                <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                <RadialBar
                  dataKey="progress"
                  background
                  cornerRadius={12}
                  isAnimationActive={false}
                />
              </RadialBarChart>
            </ChartContainer>
            {showScale && (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 text-[10px] text-muted-foreground"
              >
                <span className="absolute top-0 left-1/2 -translate-x-1/2">0%</span>
                <span className="absolute top-1/2 right-0 -translate-y-1/2">25%</span>
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2">50%</span>
                <span className="absolute top-1/2 left-0 -translate-y-1/2">75%</span>
              </div>
            )}
          </div>
          <ul className={showLegend ? "space-y-3" : "sr-only"}>
            {rings.map((item) => (
              <li
                key={item.id}
                role="meter"
                aria-label={item.label}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={item.progress}
                aria-valuetext={`${formatValue(item.current)} de ${formatValue(item.target)}; ${Math.round(item.percentage)}%`}
                className="flex items-center gap-2 text-xs"
              >
                <span
                  aria-hidden="true"
                  className="size-2 shrink-0 rounded-full"
                  style={{ backgroundColor: item.fill }}
                />
                <span className="min-w-0 flex-1 wrap-anywhere text-muted-foreground">
                  {item.label}
                </span>
                <span className="font-medium tabular-nums">{Math.round(item.percentage)}%</span>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p
          role="status"
          className="flex h-60 items-center justify-center text-center text-sm text-muted-foreground"
        >
          {emptyMessage}
        </p>
      )}
    </StatisticCard>
  );
}

export { StatisticRingCard, type StatisticRingCardProps, type StatisticRingItem };
