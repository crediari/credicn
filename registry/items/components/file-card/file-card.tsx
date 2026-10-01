import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import type * as React from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const fileCardVariants = cva(
  "group/file-card relative flex w-fit max-w-full min-w-0 shrink-0 flex-wrap rounded-xl border bg-card text-card-foreground transition-colors focus-within:ring-1 focus-within:ring-ring/50 has-[>a,>button]:hover:bg-muted/50 data-[state=error]:border-destructive/30 data-[state=idle]:border-dashed",
  {
    variants: {
      size: {
        default:
          "gap-2 text-sm has-data-[slot=file-card-content]:px-2.5 has-data-[slot=file-card-content]:py-2 has-data-[slot=file-card-media]:p-2",
        sm: "gap-2.5 text-xs has-data-[slot=file-card-content]:px-2 has-data-[slot=file-card-content]:py-1.5 has-data-[slot=file-card-media]:p-1.5",
        xs: "gap-1.5 rounded-lg text-xs has-data-[slot=file-card-content]:px-1.5 has-data-[slot=file-card-content]:py-1 has-data-[slot=file-card-media]:p-1",
      },
      orientation: {
        horizontal: "min-w-40 items-center",
        vertical: "w-24 flex-col has-data-[slot=file-card-content]:w-30",
      },
    },
  },
);

function FileCard({
  className,
  state = "done",
  size = "default",
  orientation = "horizontal",
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof fileCardVariants> & {
    state?: "idle" | "uploading" | "processing" | "error" | "done";
  }) {
  return (
    <div
      data-slot="file-card"
      data-state={state}
      data-size={size}
      data-orientation={orientation}
      className={cn(fileCardVariants({ size, orientation }), className)}
      {...props}
    />
  );
}

const fileCardMediaVariants = cva(
  "relative flex aspect-square w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted text-foreground group-data-[orientation=vertical]/file-card:w-full group-data-[size=sm]/file-card:w-8 group-data-[size=xs]/file-card:w-7 group-data-[size=xs]/file-card:rounded-md group-data-[state=error]/file-card:bg-destructive/10 group-data-[state=error]/file-card:text-destructive group-data-[orientation=vertical]/file-card:*:data-[slot=spinner]:size-6! [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 group-data-[orientation=vertical]/file-card:[&_svg:not([class*='size-'])]:size-6 group-data-[size=xs]/file-card:[&_svg:not([class*='size-'])]:size-3.5",
  {
    variants: {
      variant: {
        icon: "",
        image:
          "opacity-60 group-data-[state=done]/file-card:opacity-100 group-data-[state=idle]/file-card:opacity-100 *:[img]:aspect-square *:[img]:w-full *:[img]:object-cover",
      },
    },
    defaultVariants: {
      variant: "icon",
    },
  },
);

function FileCardMedia({
  className,
  variant = "icon",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof fileCardMediaVariants>) {
  return (
    <div
      data-slot="file-card-media"
      data-variant={variant}
      className={cn(fileCardMediaVariants({ variant }), className)}
      {...props}
    />
  );
}

function FileCardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="file-card-content"
      className={cn(
        "max-w-full min-w-0 flex-1 leading-tight group-data-[orientation=vertical]/file-card:px-1",
        className,
      )}
      {...props}
    />
  );
}

function FileCardTitle({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="file-card-title"
      className={cn(
        "block max-w-full min-w-0 truncate font-medium group-data-[state=processing]/file-card:animate-pulse group-data-[state=uploading]/file-card:animate-pulse",
        className,
      )}
      {...props}
    />
  );
}

function FileCardDescription({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="file-card-description"
      className={cn(
        "mt-0.5 block max-w-full min-w-0 truncate text-xs text-muted-foreground group-data-[state=error]/file-card:text-destructive/80",
        className,
      )}
      {...props}
    />
  );
}

function FileCardActions({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="file-card-actions"
      className={cn(
        "relative z-20 flex shrink-0 items-center group-data-[orientation=vertical]/file-card:absolute group-data-[orientation=vertical]/file-card:top-3 group-data-[orientation=vertical]/file-card:right-3 group-data-[orientation=vertical]/file-card:gap-1",
        className,
      )}
      {...props}
    />
  );
}

function FileCardAction({
  className,
  variant,
  size = "icon-xs",
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <Button
      data-slot="file-card-action"
      variant={variant ?? "ghost"}
      size={size}
      className={cn(className)}
      {...props}
    />
  );
}

function FileCardTrigger({
  className,
  asChild = false,
  type,
  ...props
}: React.ComponentProps<"button"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="file-card-trigger"
      type={asChild ? type : (type ?? "button")}
      className={cn("absolute inset-0 z-10 outline-none", className)}
      {...props}
    />
  );
}

function FileCardGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="file-card-group"
      className={cn(
        "flex min-w-0 snap-x snap-mandatory scroll-px-1 gap-3 overflow-x-auto overscroll-x-contain py-1 [scrollbar-width:none] *:data-[slot=file-card]:flex-none *:data-[slot=file-card]:snap-start [&::-webkit-scrollbar]:hidden",
        className,
      )}
      {...props}
    />
  );
}

export {
  FileCard,
  FileCardAction,
  FileCardActions,
  FileCardContent,
  FileCardDescription,
  FileCardGroup,
  FileCardMedia,
  FileCardTitle,
  FileCardTrigger,
};
