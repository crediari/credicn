"use client";

import { MessageSquareText, ShieldCheck, UserRoundPlus } from "lucide-react";
import { useState } from "react";

import {
  NotificationCenter,
  type NotificationCenterItem,
  type NotificationCenterPreference,
} from "./notification-center";

const initialNotifications: NotificationCenterItem[] = [
  {
    id: "ticket-assigned",
    title: "A new ticket has been assigned to you",
    description: "Ticket #4821 needs an initial response.",
    createdAt: "2026-09-29T11:56:00-04:00",
    read: false,
    tone: "info",
    metadata: "Support",
    icon: <UserRoundPlus />,
  },
  {
    id: "mention",
    title: "You were mentioned",
    description: "Ana mentioned you in a comment about ERP access.",
    createdAt: "2026-09-29T10:35:00-04:00",
    read: false,
    tone: "warning",
    metadata: "Comment",
    icon: <MessageSquareText />,
  },
  {
    id: "policy",
    title: "Access policy updated",
    description: "The new authentication rules are now available.",
    createdAt: "2026-09-28T09:20:00-04:00",
    read: true,
    tone: "success",
    metadata: "Security",
    icon: <ShieldCheck />,
  },
];

const initialPreferences: NotificationCenterPreference[] = [
  {
    id: "assignments",
    label: "Assignments",
    description: "Notify me when a task is assigned to me.",
    enabled: true,
  },
  {
    id: "mentions",
    label: "Mentions and replies",
    description: "Notify me when someone mentions me or replies to a comment.",
    enabled: true,
  },
  {
    id: "product-news",
    label: "Product news",
    description: "Receive announcements about improvements and new features.",
    enabled: false,
  },
];

export function Preview() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [preferences, setPreferences] = useState(initialPreferences);
  const [feedback, setFeedback] = useState("Open the bell to view notifications.");

  function markAsRead(selected: NotificationCenterItem) {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === selected.id ? { ...notification, read: true } : notification,
      ),
    );
    setFeedback(`Marked as read: ${selected.title}`);
  }

  return (
    <div className="flex w-full flex-col items-center justify-center gap-4">
      <NotificationCenter
        notifications={notifications}
        preferences={preferences}
        onMarkAsRead={markAsRead}
        onMarkAllAsRead={(unread) => {
          const unreadIds = new Set(unread.map((notification) => notification.id));
          setNotifications((current) =>
            current.map((notification) =>
              unreadIds.has(notification.id) ? { ...notification, read: true } : notification,
            ),
          );
          setFeedback("All notifications have been marked as read.");
        }}
        onNotificationOpen={(notification) =>
          setFeedback(`Open notification destination: ${notification.title}`)
        }
        onPreferenceChange={(selected, enabled) => {
          setPreferences((current) =>
            current.map((preference) =>
              preference.id === selected.id ? { ...preference, enabled } : preference,
            ),
          );
          setFeedback(`${selected.label}: ${enabled ? "enabled" : "disabled"}`);
        }}
      />
      <div className="text-center">
        <p className="text-sm font-medium">Notification center</p>
        <p className="mt-1 text-xs text-muted-foreground" aria-live="polite">
          {feedback}
        </p>
      </div>
    </div>
  );
}
