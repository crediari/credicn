"use client";

import { Target } from "lucide-react";

import { StatisticGoalCard } from "./statistic-goal-card";

const currency = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

export function Preview() {
  return (
    <div className="grid w-full max-w-2xl gap-4 sm:grid-cols-2">
      <StatisticGoalCard
        title="Meta de recuperação"
        description="Novembro de 2026"
        icon={<Target />}
        current={74500}
        target={100000}
        targetLabel="Meta mensal"
        formatValue={currency}
        footer="Faltam 14 dias para fechar o período"
      />
      <StatisticGoalCard
        title="Contratos concluídos"
        description="Meta superada"
        icon={<Target />}
        current={128}
        target={100}
        targetLabel="Meta de contratos"
        footer="28 contratos acima da meta"
      />
      <StatisticGoalCard
        layout="compact"
        title="Satisfação dos clientes"
        current={92}
        target={100}
        value="92 de 100"
        color="var(--chart-2)"
        targetLabel="Índice esperado"
      />
      <StatisticGoalCard
        layout="inline"
        title="Onboarding"
        description="Equipe comercial"
        current={18}
        target={24}
        value="18 / 24"
        color="var(--chart-3)"
        targetLabel="Colaboradores"
      />
    </div>
  );
}
