"use client";

import { StatisticRingCard } from "./statistic-ring-card";

const sales = [
  { id: "sales", label: "Vendas", current: 48, target: 100, color: "var(--chart-1)" },
  { id: "orders", label: "Pedidos", current: 74, target: 100, color: "var(--chart-2)" },
  { id: "conversion", label: "Conversão", current: 26, target: 100, color: "var(--chart-3)" },
];

export function Preview() {
  return (
    <div className="grid w-full max-w-4xl gap-4 sm:grid-cols-2">
      <StatisticRingCard
        title="Visão geral de vendas"
        description="Últimos 7 dias"
        data={sales}
        showScale
        showLegend={false}
      />
      <StatisticRingCard
        title="Metas da operação"
        description="Novembro de 2026"
        value="3 indicadores"
        data={sales}
        footer="Progresso individual em relação à meta"
      />
      <StatisticRingCard
        layout="compact"
        title="Desempenho das equipes"
        data={[
          { id: "north", label: "Equipe Norte", current: 128, target: 100 },
          { id: "south", label: "Equipe Sul", current: 86, target: 100 },
          { id: "digital", label: "Equipe Digital", current: 92, target: 100 },
          { id: "partners", label: "Parceiros", current: 64, target: 100 },
        ]}
      />
      <StatisticRingCard
        layout="inline"
        title="Planejamento"
        description="Metas trimestrais"
        value="2 frentes"
        data={[
          { id: "revenue", label: "Receita", current: 74500, target: 100000 },
          { id: "retention", label: "Retenção", current: 42000, target: 50000 },
        ]}
        formatValue={(value) =>
          value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
            maximumFractionDigits: 0,
          })
        }
      />
    </div>
  );
}
