"use client";

import { Bar, BarChart, Pie, PieChart, XAxis, YAxis } from "recharts";

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

import { StatisticCard, type StatisticCardProps } from "../statistic-card/statistic-card";

type StatisticBreakdownItem = { label: string; value: number; color?: string };
type StatisticBreakdownCardProps = Omit<StatisticCardProps, "value" | "children"> & {
  data: readonly StatisticBreakdownItem[];
  value?: StatisticCardProps["value"];
  formatValue?: (value: number) => string;
  centerLabel?: string;
  variant?: "donut" | "stacked";
  showLegend?: boolean;
  emptyMessage?: string;
};

function StatisticBreakdownCard({
  data,
  value,
  formatValue = (amount) => amount.toLocaleString("pt-BR"),
  centerLabel = "Total",
  variant = "donut",
  showLegend = true,
  emptyMessage = "Nenhum dado para distribuir.",
  ...props
}: StatisticBreakdownCardProps) {
  const chartData = data.map((item, index) => ({
    ...item,
    name: `segment${index}`,
    value: Number.isFinite(item.value) ? Math.max(0, item.value) : 0,
    fill: item.color ?? `var(--chart-${(index % 5) + 1})`,
  }));
  const total = chartData.reduce((sum, item) => sum + item.value, 0);
  const config = Object.fromEntries(
    chartData.map((item) => [item.name, { label: item.label, color: item.fill }]),
  );

  return (
    <StatisticCard value={value ?? formatValue(total)} {...props}>
      {total > 0 ? (
        <>
          {variant === "stacked" ? (
            <ChartContainer
              config={config}
              className="aspect-auto h-5 w-full"
              aria-label={`Distribuição de ${props.title}`}
            >
              <BarChart
                accessibilityLayer
                layout="vertical"
                data={[Object.fromEntries(chartData.map((item) => [item.name, item.value]))]}
                margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
              >
                <XAxis type="number" domain={[0, total]} hide />
                <YAxis type="category" hide />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      hideLabel
                      formatter={(amount, name) => (
                        <>
                          <span className="text-muted-foreground">
                            {config[String(name)]?.label}
                          </span>
                          <span className="ml-auto font-medium tabular-nums">
                            {formatValue(Number(amount))}
                          </span>
                        </>
                      )}
                    />
                  }
                />
                {chartData.map((item) => (
                  <Bar
                    key={item.name}
                    dataKey={item.name}
                    stackId="distribution"
                    fill={item.fill}
                    radius={3}
                    barSize={8}
                    isAnimationActive={false}
                  />
                ))}
              </BarChart>
            </ChartContainer>
          ) : (
            <div className="relative mx-auto size-44">
              <ChartContainer
                config={config}
                className="aspect-square size-full"
                aria-label={`Distribuição de ${props.title}`}
              >
                <PieChart accessibilityLayer>
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        nameKey="name"
                        hideLabel
                        formatter={(amount, name) => (
                          <>
                            <span className="text-muted-foreground">
                              {config[String(name)]?.label}
                            </span>
                            <span className="ml-auto font-medium tabular-nums">
                              {formatValue(Number(amount))}
                            </span>
                          </>
                        )}
                      />
                    }
                  />
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius="74%"
                    outerRadius="95%"
                    paddingAngle={3}
                    cornerRadius={5}
                    strokeWidth={0}
                    isAnimationActive={false}
                  />
                </PieChart>
              </ChartContainer>
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 flex items-center justify-center text-xs text-muted-foreground"
              >
                {centerLabel}
              </div>
            </div>
          )}
          <ul
            className={!showLegend ? "sr-only" : variant === "stacked" ? "divide-y" : "space-y-3"}
          >
            {chartData.map((item) => (
              <li
                key={item.name}
                className={
                  variant === "stacked"
                    ? "flex items-center gap-2 py-3 text-xs"
                    : "flex items-center gap-2 text-xs"
                }
              >
                <span
                  aria-hidden="true"
                  className="size-2 shrink-0 rounded-full"
                  style={{ backgroundColor: item.fill }}
                />
                <span className="min-w-0 flex-1 wrap-anywhere text-muted-foreground">
                  {item.label}
                </span>
                <span className="font-medium tabular-nums">{formatValue(item.value)}</span>
                <span className="w-10 text-right text-muted-foreground tabular-nums">
                  {((item.value / total) * 100).toLocaleString("pt-BR", {
                    maximumFractionDigits: 1,
                  })}
                  %
                </span>
              </li>
            ))}
          </ul>
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

export { StatisticBreakdownCard, type StatisticBreakdownCardProps, type StatisticBreakdownItem };
