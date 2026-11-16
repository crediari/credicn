"use client";

import { ArrowDownRight, ArrowRight, ArrowUpRight } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type StatisticTrend = {
  label: string;
  direction: "up" | "down" | "flat";
  tone?: "positive" | "negative" | "neutral";
  description?: string;
};
type StatisticCardProps = Omit<ComponentProps<typeof Card>, "title"> & {
  title: string;
  value?: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  trend?: StatisticTrend;
  footer?: ReactNode;
  layout?: "default" | "compact" | "inline";
};

function StatisticTrendBadge({ trend }: { trend: StatisticTrend }) {
  const Icon =
    trend.direction === "up"
      ? ArrowUpRight
      : trend.direction === "down"
        ? ArrowDownRight
        : ArrowRight;
  return (
    <div className="flex flex-wrap items-center gap-2 text-xs">
      <Badge
        variant="secondary"
        className={cn(
          "gap-1",
          trend.tone === "positive" && "bg-primary text-primary-foreground",
          trend.tone === "negative" && "bg-destructive/10 text-destructive",
        )}
      >
        <Icon aria-hidden="true" className="size-3.5" />
        {trend.label}
      </Badge>
      {trend.description && <span className="text-muted-foreground">{trend.description}</span>}
    </div>
  );
}

function StatisticCard({
  title,
  value,
  description,
  icon,
  trend,
  footer,
  children,
  className,
  layout = "default",
  size,
  ...props
}: StatisticCardProps) {
  const inline = layout === "inline";
  const metric = (
    <>
      {value !== undefined && value !== null && (
        <div
          className={cn(
            "font-semibold tracking-tight wrap-anywhere tabular-nums",
            layout === "default" ? "text-3xl" : layout === "compact" ? "text-2xl" : "text-lg",
          )}
        >
          {value}
        </div>
      )}
      {trend && <StatisticTrendBadge trend={trend} />}
    </>
  );
  return (
    <Card
      size={size ?? (layout === "compact" ? "sm" : "default")}
      className={cn("min-w-0 gap-5", layout === "compact" && "gap-3", className)}
      {...props}
    >
      <CardHeader className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          {description && <div className="text-xs text-muted-foreground">{description}</div>}
        </div>
        {inline ? (
          <div className="grid min-w-0 justify-items-end gap-1 text-right">{metric}</div>
        ) : (
          icon && (
            <span
              aria-hidden="true"
              className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground [&_svg]:size-5"
            >
              {icon}
            </span>
          )
        )}
      </CardHeader>
      {(!inline || children) && (
        <CardContent className={cn("space-y-4", layout === "compact" && "space-y-3")}>
          {!inline && metric}
          {children}
        </CardContent>
      )}
      {footer && (
        <CardFooter className="mt-auto border-t text-xs text-muted-foreground">{footer}</CardFooter>
      )}
    </Card>
  );
}

export { StatisticCard, type StatisticCardProps, type StatisticTrend };
