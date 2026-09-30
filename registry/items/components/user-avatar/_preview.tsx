"use client";

import { UserAvatar, UserAvatarGroup } from "./user-avatar";

const team = [
  { id: 1, username: "Ana Costa", userimage: null },
  { id: 2, username: "João", userimage: null },
  { id: 3, username: "Maria Silva", userimage: null },
  { id: 4, username: "Carlos Oliveira", userimage: null },
  { id: 5, username: "Érica", userimage: null },
  { id: 6, username: "Pedro Lima", userimage: null },
];

export function Preview() {
  return (
    <div className="grid gap-8">
      <Example label="Fallbacks para nomes completos e simples">
        <div className="flex items-center gap-3">
          <UserAvatar username="Ana Costa" userimage={null} />
          <UserAvatar username="João" userimage={null} size="lg" />
          <UserAvatar
            username="Maria Silva"
            userimage={null}
            className="size-12"
            textSize="text-lg"
          />
        </div>
      </Example>

      <Example label="Grupo com limite e contador">
        <UserAvatarGroup users={team} max={4} />
      </Example>

      <Example label="Tamanhos do grupo">
        <div className="flex flex-col items-start gap-4">
          <UserAvatarGroup users={team.slice(0, 4)} max={3} size="sm" />
          <UserAvatarGroup users={team.slice(0, 5)} max={4} />
          <UserAvatarGroup users={team} max={5} size="lg" />
        </div>
      </Example>
    </div>
  );
}

function Example({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="grid gap-3">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      {children}
    </section>
  );
}
