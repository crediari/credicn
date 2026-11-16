"use client";

import { StatisticsWidgets } from "./statistics-widgets";

const points = [
  { label: "Seg", value: 30, comparison: 48 },
  { label: "Ter", value: 65, comparison: 36 },
  { label: "Qua", value: 38, comparison: 42 },
  { label: "Qui", value: 90, comparison: 30 },
  { label: "Sex", value: 52, comparison: 46 },
  { label: "Sáb", value: 35, comparison: 38 },
  { label: "Dom", value: 68, comparison: 42 },
];

export function Preview() {
  return (
    <div className="w-full max-w-6xl space-y-6">
      <StatisticsWidgets
        customers={{
          title: "Clientes",
          description: "Últimos 7 dias",
          value: "6.380",
          data: points.map(({ label, value }) => ({ label, value })),
          color: "var(--chart-2)",
          trend: { label: "+26,5%", direction: "up", tone: "positive" },
          footer: "6.380 neste período · 4.298 na semana anterior",
        }}
        products={{
          title: "Produtos",
          description: "Últimos 7 dias",
          value: "12.389",
          data: [
            { label: "Concluídos", value: 68 },
            { label: "Em andamento", value: 25 },
            { label: "Pendentes", value: 7 },
          ],
          centerLabel: "Produtos",
          trend: { label: "+26,5%", direction: "up", tone: "positive" },
          footer: "R$ 18 mil de lucro a mais neste mês",
        }}
        deal={{
          title: "Último negócio",
          description: "Últimos 7 dias",
          current: 98500,
          target: 122900,
          value: "80,1%",
          color: "var(--chart-2)",
          currentLabel: "Realizado",
          targetLabel: "Objetivo",
          formatValue: (value) =>
            value.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
              maximumFractionDigits: 0,
            }),
          children: (
            <div className="space-y-4 pt-4">
              <p className="text-xs text-muted-foreground">Cupons usados: 18/22</p>
              <div>
                <p className="mb-3 text-xs font-medium">Compradores recentes</p>
                <div className="flex -space-x-2">
                  {["AC", "BL", "CS", "+4"].map((name) => (
                    <span
                      key={name}
                      className="flex size-8 items-center justify-center rounded-full border-2 border-card bg-muted text-[10px] font-medium"
                    >
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ),
        }}
        payments={{
          title: "Pagamentos",
          description: "Últimos 7 dias",
          value: "12.389",
          data: points,
          valueLabel: "Pix",
          comparisonLabel: "Cartão",
          trend: { label: "+26,5%", direction: "up", tone: "positive" },
          footer: "Pix: 52% · Cartão: 48%",
        }}
      />
    </div>
  );
}
