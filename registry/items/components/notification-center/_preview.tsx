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
    title: "Novo chamado atribuído a você",
    description: "O chamado #4821 precisa de uma primeira resposta.",
    createdAt: "2026-09-29T11:56:00-04:00",
    read: false,
    tone: "info",
    metadata: "Atendimento",
    icon: <UserRoundPlus />,
  },
  {
    id: "mention",
    title: "Você recebeu uma menção",
    description: "Ana mencionou você em um comentário sobre o acesso ao ERP.",
    createdAt: "2026-09-29T10:35:00-04:00",
    read: false,
    tone: "warning",
    metadata: "Comentário",
    icon: <MessageSquareText />,
  },
  {
    id: "policy",
    title: "Política de acesso atualizada",
    description: "As novas regras de autenticação já estão disponíveis.",
    createdAt: "2026-09-28T09:20:00-04:00",
    read: true,
    tone: "success",
    metadata: "Segurança",
    icon: <ShieldCheck />,
  },
];

const initialPreferences: NotificationCenterPreference[] = [
  {
    id: "assignments",
    label: "Atribuições",
    description: "Avise quando uma atividade for atribuída a você.",
    enabled: true,
  },
  {
    id: "mentions",
    label: "Menções e respostas",
    description: "Avise quando alguém mencionar você ou responder a um comentário.",
    enabled: true,
  },
  {
    id: "product-news",
    label: "Novidades do sistema",
    description: "Receba comunicados sobre melhorias e novos recursos.",
    enabled: false,
  },
];

export function Preview() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [preferences, setPreferences] = useState(initialPreferences);
  const [feedback, setFeedback] = useState("Abra o sino para visualizar as notificações.");

  function markAsRead(selected: NotificationCenterItem) {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === selected.id ? { ...notification, read: true } : notification,
      ),
    );
    setFeedback(`Marcada como lida: ${selected.title}`);
  }

  return (
    <div className="flex min-h-48 w-full max-w-2xl flex-col items-center justify-center gap-4 rounded-2xl border bg-card p-8">
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
          setFeedback("Todas as notificações foram marcadas como lidas.");
        }}
        onNotificationOpen={(notification) =>
          setFeedback(`Abrir destino da notificação: ${notification.title}`)
        }
        onPreferenceChange={(selected, enabled) => {
          setPreferences((current) =>
            current.map((preference) =>
              preference.id === selected.id ? { ...preference, enabled } : preference,
            ),
          );
          setFeedback(`${selected.label}: ${enabled ? "ativada" : "desativada"}`);
        }}
      />
      <div className="text-center">
        <p className="text-sm font-medium">Central de notificações</p>
        <p className="mt-1 text-xs text-muted-foreground" aria-live="polite">
          {feedback}
        </p>
      </div>
    </div>
  );
}
