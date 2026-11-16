"use client";

import { Target, Ticket, Wallet } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { StatisticProgressCard } from "./statistic-progress-card";

const currency = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

export function Preview() {
  return (
    <div className="grid w-full max-w-4xl gap-4 sm:grid-cols-2">
      <StatisticProgressCard
        layout="inline"
        title="Último negócio"
        description="Últimos 7 dias"
        current={98500}
        target={122900}
        value="80,1%"
        color="var(--chart-2)"
        currentLabel="Cupons usados: 18/22"
        targetLabel="Objetivo"
        formatValue={currency}
      >
        <div className="space-y-3 pt-4">
          <p className="text-xs font-medium">Compradores recentes</p>
          <div className="flex -space-x-2">
            {["Ana Costa", "Bruno Lima", "Carla Souza"].map((name) => (
              <Avatar key={name} className="size-9 border-2 border-card">
                <AvatarFallback className="bg-muted text-xs text-foreground">
                  {name
                    .split(" ")
                    .map((part) => part[0])
                    .join("")}
                </AvatarFallback>
                <span className="sr-only">{name}</span>
              </Avatar>
            ))}
            <span
              className="flex size-9 items-center justify-center rounded-full border-2 border-card bg-muted text-xs font-medium"
              aria-label="Mais 4 compradores"
            >
              +4
            </span>
          </div>
        </div>
      </StatisticProgressCard>
      <StatisticProgressCard
        title="Orçamento utilizado"
        description="Novembro de 2026"
        icon={<Wallet />}
        current={72000}
        target={100000}
        value="R$ 72.000"
        formatValue={currency}
        currentLabel="Utilizado"
        targetLabel="Orçamento"
        color="var(--chart-3)"
        footer="R$ 28.000 disponíveis até o fim do mês"
      />
      <StatisticProgressCard
        layout="compact"
        title="Campanha de cupons"
        icon={<Ticket />}
        current={186}
        target={250}
        currentLabel="Resgatados"
        targetLabel="Disponíveis"
        color="var(--chart-4)"
        footer="64 cupons restantes"
      />
      <StatisticProgressCard
        layout="compact"
        title="Meta de contratos"
        icon={<Target />}
        current={128}
        target={100}
        currentLabel="Concluídos"
        targetLabel="Meta do mês"
        color="var(--chart-2)"
        footer="Meta superada em 28 contratos"
      />
    </div>
  );
}
