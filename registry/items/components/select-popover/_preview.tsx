"use client";

import { useState } from "react";

import { SelectPopover } from "./select-popover";

type User = {
  id: number;
  name: string;
  email: string;
};

type City = {
  id: number;
  name: string;
  state: string;
};

const users: User[] = [
  { id: 1, name: "Ana Costa", email: "ana.costa@crediari.com" },
  { id: 2, name: "Bruno Lima", email: "bruno.lima@crediari.com" },
  { id: 3, name: "Carla Souza", email: "carla.souza@crediari.com" },
  { id: 4, name: "Diego Alves", email: "diego.alves@crediari.com" },
];

const cities: City[] = Array.from({ length: 1000 }, (_, index) => ({
  id: index + 1,
  name: `Cidade ${String(index + 1).padStart(4, "0")}`,
  state: ["RO", "AC", "AM", "MT"][index % 4],
}));

export function Preview() {
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [city, setCity] = useState<City | null>(null);

  return (
    <div className="grid w-full max-w-3xl gap-8 md:grid-cols-2">
      <div className="space-y-2">
        <div>
          <p className="text-sm font-medium">Responsáveis</p>
          <p className="text-xs text-muted-foreground">
            Seleção múltipla com conteúdo customizado.
          </p>
        </div>
        <SelectPopover
          multiple
          items={users}
          value={selectedUsers}
          onValueChange={setSelectedUsers}
          getItemValue={(user) => user.id}
          getItemLabel={(user) => user.name}
          getItemKeywords={(user) => [user.email]}
          placeholder="Selecionar usuários..."
          renderValue={(value) =>
            value.length === 1 ? value[0].name : `${value.length} responsáveis`
          }
          renderItem={(user) => (
            <div className="flex items-center gap-3">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                {getInitials(user.name)}
              </span>
              <span className="min-w-0 text-left">
                <span className="block truncate font-medium">{user.name}</span>
                <span className="block truncate text-xs text-muted-foreground">{user.email}</span>
              </span>
            </div>
          )}
        />
      </div>

      <div className="space-y-2">
        <div>
          <p className="text-sm font-medium">Cidade</p>
          <p className="text-xs text-muted-foreground">1.000 itens, no máximo 40 na DOM.</p>
        </div>
        <SelectPopover
          items={cities}
          value={city}
          onValueChange={setCity}
          getItemValue={(item) => item.id}
          getItemLabel={(item) => item.name}
          getItemKeywords={(item) => [item.state]}
          resultLimit={40}
          placeholder="Selecionar cidade..."
          renderItem={(item) => (
            <div className="flex items-center justify-between gap-3">
              <span className="truncate">{item.name}</span>
              <span className="text-xs text-muted-foreground">{item.state}</span>
            </div>
          )}
        />
      </div>
    </div>
  );
}

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("");
}
