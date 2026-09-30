"use client";

import {
  AlertTriangle,
  Bell,
  Check,
  CheckCheck,
  CircleAlert,
  Info,
  LoaderCircle,
  MailOpen,
  RefreshCw,
  SlidersHorizontal,
  type LucideIcon,
} from "lucide-react";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

type NotificationCenterTone = "default" | "info" | "success" | "warning" | "error";

type NotificationCenterItem = {
  id: string;
  title: string;
  description?: string;
  createdAt: Date | string | number;
  read: boolean;
  tone?: NotificationCenterTone;
  icon?: React.ReactNode;
  metadata?: string;
  href?: string;
};

type NotificationCenterPreference = {
  id: string;
  label: string;
  description?: string;
  enabled: boolean;
  disabled?: boolean;
};

type NotificationCenterProps = {
  notifications: NotificationCenterItem[];
  preferences?: NotificationCenterPreference[];
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onNotificationOpen?: (notification: NotificationCenterItem) => void;
  onMarkAsRead?: (notification: NotificationCenterItem) => void | Promise<void>;
  onMarkAllAsRead?: (notifications: NotificationCenterItem[]) => void | Promise<void>;
  onPreferenceChange?: (
    preference: NotificationCenterPreference,
    enabled: boolean,
  ) => void | Promise<void>;
  pendingNotificationIds?: string[];
  pendingPreferenceIds?: string[];
  markingAllAsRead?: boolean;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  title?: string;
  description?: string;
  triggerLabel?: string;
  emptyUnreadTitle?: string;
  emptyReadTitle?: string;
  closeOnNotificationOpen?: boolean;
  locale?: string;
  formatTimestamp?: (createdAt: NotificationCenterItem["createdAt"]) => string;
  className?: string;
  triggerClassName?: string;
};

const toneStyles: Record<NotificationCenterTone, { icon: LucideIcon; className: string }> = {
  default: { icon: Bell, className: "border-border bg-muted text-muted-foreground" },
  info: { icon: Info, className: "border-primary/20 bg-primary/10 text-primary" },
  success: { icon: Check, className: "border-primary/20 bg-primary/10 text-primary" },
  warning: {
    icon: AlertTriangle,
    className: "border-border bg-secondary text-secondary-foreground",
  },
  error: {
    icon: CircleAlert,
    className: "border-destructive/20 bg-destructive/10 text-destructive",
  },
};

function NotificationCenter({
  notifications,
  preferences = [],
  open,
  defaultOpen,
  onOpenChange,
  onNotificationOpen,
  onMarkAsRead,
  onMarkAllAsRead,
  onPreferenceChange,
  pendingNotificationIds = [],
  pendingPreferenceIds = [],
  markingAllAsRead = false,
  loading = false,
  error,
  onRetry,
  title = "Notificações",
  description = "Acompanhe atualizações importantes e gerencie como deseja recebê-las.",
  triggerLabel = "Abrir notificações",
  emptyUnreadTitle = "Você está em dia!",
  emptyReadTitle = "As notificações lidas aparecerão aqui.",
  closeOnNotificationOpen = true,
  locale = "pt-BR",
  formatTimestamp,
  className,
  triggerClassName,
}: NotificationCenterProps) {
  const unreadNotifications = notifications.filter((notification) => !notification.read);
  const readNotifications = notifications.filter((notification) => notification.read);
  const unreadCount = unreadNotifications.length;
  const hasPreferences = preferences.length > 0;
  const pendingNotifications = React.useMemo(
    () => new Set(pendingNotificationIds),
    [pendingNotificationIds],
  );
  const pendingPreferences = React.useMemo(
    () => new Set(pendingPreferenceIds),
    [pendingPreferenceIds],
  );
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen ?? false);
  const isControlled = open !== undefined;
  const resolvedOpen = isControlled ? open : internalOpen;

  function handleOpenChange(nextOpen: boolean) {
    if (!isControlled) setInternalOpen(nextOpen);
    onOpenChange?.(nextOpen);
  }

  function handleNotificationOpen(notification: NotificationCenterItem) {
    if (!notification.read) void onMarkAsRead?.(notification);
    onNotificationOpen?.(notification);
    if (closeOnNotificationOpen) handleOpenChange(false);
  }

  function getTimestamp(createdAt: NotificationCenterItem["createdAt"]) {
    return formatTimestamp?.(createdAt) ?? formatNotificationTimestamp(createdAt, locale);
  }

  return (
    <Dialog open={resolvedOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className={cn("relative rounded-full", triggerClassName)}
            aria-label={
              unreadCount > 0 ? `${triggerLabel}: ${unreadCount} não lidas` : triggerLabel
            }
          />
        }
      >
        <Bell />
        {unreadCount > 0 && (
          <Badge
            aria-hidden="true"
            className="pointer-events-none absolute -top-1.5 -right-1.5 h-5 min-w-5 px-1 text-[10px] tabular-nums"
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </Badge>
        )}
      </DialogTrigger>

      <DialogContent className={cn("max-w-lg! gap-0 overflow-hidden p-0", className)}>
        <DialogHeader className="border-b px-5 py-4 pr-12">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="unread" className="gap-0">
          <div className="border-b px-4 py-2.5">
            <TabsList variant="line" className="w-full justify-start">
              <TabsTrigger value="unread">
                Não lidas
                {unreadCount > 0 && <Badge variant="secondary">{unreadCount}</Badge>}
              </TabsTrigger>
              <TabsTrigger value="read">Lidas</TabsTrigger>
              {hasPreferences && (
                <TabsTrigger value="preferences">
                  <SlidersHorizontal />
                  Preferências
                </TabsTrigger>
              )}
            </TabsList>
          </div>

          <TabsContent value="unread">
            <NotificationList
              notifications={unreadNotifications}
              emptyIcon={Bell}
              emptyTitle={emptyUnreadTitle}
              error={error}
              getTimestamp={getTimestamp}
              loading={loading}
              onNotificationOpen={handleNotificationOpen}
              onMarkAsRead={onMarkAsRead}
              onRetry={onRetry}
              pendingNotifications={pendingNotifications}
              showReadAction
            />

            {!loading && !error && unreadCount > 0 && onMarkAllAsRead && (
              <div className="border-t p-3">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-muted-foreground"
                  disabled={markingAllAsRead}
                  onClick={() => void onMarkAllAsRead(unreadNotifications)}
                >
                  {markingAllAsRead ? <LoaderCircle className="animate-spin" /> : <CheckCheck />}
                  Marcar todas como lidas
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="read">
            <NotificationList
              notifications={readNotifications}
              emptyIcon={MailOpen}
              emptyTitle={emptyReadTitle}
              error={error}
              getTimestamp={getTimestamp}
              loading={loading}
              onNotificationOpen={handleNotificationOpen}
              onRetry={onRetry}
              pendingNotifications={pendingNotifications}
            />
          </TabsContent>

          {hasPreferences && (
            <TabsContent value="preferences">
              <ScrollArea className="max-h-[min(24rem,calc(100vh-14rem))]">
                <div className="divide-y">
                  {preferences.map((preference) => (
                    <div className="flex items-center gap-4 px-5 py-4" key={preference.id}>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium">{preference.label}</p>
                        {preference.description && (
                          <p className="mt-1 text-xs text-muted-foreground">
                            {preference.description}
                          </p>
                        )}
                      </div>
                      <Switch
                        aria-label={preference.label}
                        checked={preference.enabled}
                        disabled={
                          preference.disabled ||
                          pendingPreferences.has(preference.id) ||
                          !onPreferenceChange
                        }
                        onCheckedChange={(enabled) =>
                          void onPreferenceChange?.(preference, enabled)
                        }
                      />
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          )}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

function NotificationList({
  notifications,
  emptyIcon: EmptyIcon,
  emptyTitle,
  error,
  getTimestamp,
  loading,
  onNotificationOpen,
  onMarkAsRead,
  onRetry,
  pendingNotifications,
  showReadAction = false,
}: {
  notifications: NotificationCenterItem[];
  emptyIcon: LucideIcon;
  emptyTitle: string;
  error?: string | null;
  getTimestamp: (createdAt: NotificationCenterItem["createdAt"]) => string;
  loading: boolean;
  onNotificationOpen: (notification: NotificationCenterItem) => void;
  onMarkAsRead?: (notification: NotificationCenterItem) => void | Promise<void>;
  onRetry?: () => void;
  pendingNotifications: Set<string>;
  showReadAction?: boolean;
}) {
  if (loading) {
    return (
      <div className="flex min-h-64 items-center justify-center gap-2 text-sm text-muted-foreground">
        <LoaderCircle className="animate-spin" />
        Carregando notificações...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-64 flex-col items-center justify-center gap-3 px-6 text-center">
        <span className="flex size-11 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <CircleAlert />
        </span>
        <div>
          <p className="text-sm font-medium">Não foi possível carregar as notificações</p>
          <p className="mt-1 text-xs text-muted-foreground">{error}</p>
        </div>
        {onRetry && (
          <Button variant="outline" size="sm" onClick={onRetry}>
            <RefreshCw />
            Tentar novamente
          </Button>
        )}
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="flex min-h-64 flex-col items-center justify-center gap-3 px-6 text-center">
        <span className="flex size-11 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <EmptyIcon />
        </span>
        <p className="text-sm text-muted-foreground">{emptyTitle}</p>
      </div>
    );
  }

  return (
    <ScrollArea className="max-h-[min(24rem,calc(100vh-14rem))]">
      <div className="divide-y [&>div:first-child]:border-b-0">
        {notifications.map((notification) => {
          const tone = toneStyles[notification.tone ?? "default"];
          const ToneIcon = tone.icon;
          const isPending = pendingNotifications.has(notification.id);
          const hasReadAction = showReadAction && !!onMarkAsRead;

          return (
            <div
              className="group relative mx-2 my-1 rounded-xl transition-colors focus-within:bg-muted/70 hover:bg-muted/70"
              key={notification.id}
            >
              <button
                type="button"
                className={cn(
                  "flex w-full min-w-0 items-start gap-3 rounded-xl px-2 py-2 text-left outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                  hasReadAction && "pr-10",
                )}
                onClick={() => onNotificationOpen(notification)}
              >
                <span
                  className={cn(
                    "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full border [&_svg]:size-4",
                    tone.className,
                  )}
                >
                  {notification.icon ?? <ToneIcon />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-start gap-2">
                    <span className="line-clamp-1 flex-1 text-sm font-medium">
                      {notification.title}
                    </span>
                    {!notification.read && (
                      <span
                        aria-label="Não lida"
                        className="mt-1.5 size-2 shrink-0 rounded-full bg-primary"
                      />
                    )}
                  </span>
                  {notification.description && (
                    <span className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                      {notification.description}
                    </span>
                  )}
                  <span className="mt-1.5 block text-xs text-muted-foreground">
                    {notification.metadata
                      ? `${notification.metadata} · ${getTimestamp(notification.createdAt)}`
                      : getTimestamp(notification.createdAt)}
                  </span>
                </span>
              </button>

              {hasReadAction && (
                <Button
                  variant="ghost"
                  size="icon-xs"
                  className="absolute top-1/2 right-2 -translate-y-1/2 opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100"
                  aria-label={`Marcar ${notification.title} como lida`}
                  disabled={isPending}
                  onClick={() => void onMarkAsRead?.(notification)}
                >
                  {isPending ? <LoaderCircle className="animate-spin" /> : <MailOpen />}
                </Button>
              )}
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
}

function formatNotificationTimestamp(
  createdAt: NotificationCenterItem["createdAt"],
  locale = "pt-BR",
) {
  const date = createdAt instanceof Date ? createdAt : new Date(createdAt);
  const differenceInSeconds = Math.round((date.getTime() - Date.now()) / 1000);

  if (Number.isNaN(differenceInSeconds)) return "Data desconhecida";

  const formatter = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
  const divisions = [
    { amount: 60, unit: "second" },
    { amount: 60, unit: "minute" },
    { amount: 24, unit: "hour" },
    { amount: 7, unit: "day" },
    { amount: 4.345, unit: "week" },
    { amount: 12, unit: "month" },
    { amount: Number.POSITIVE_INFINITY, unit: "year" },
  ] as const;

  let duration = differenceInSeconds;
  for (const division of divisions) {
    if (Math.abs(duration) < division.amount) {
      return formatter.format(Math.round(duration), division.unit);
    }
    duration /= division.amount;
  }

  return formatter.format(Math.round(duration), "year");
}

export {
  NotificationCenter,
  formatNotificationTimestamp,
  type NotificationCenterItem,
  type NotificationCenterPreference,
  type NotificationCenterProps,
  type NotificationCenterTone,
};
