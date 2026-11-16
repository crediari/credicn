"use client";

import { StatisticChartCard } from "./statistic-chart-card";

const revenue = [
  { label: "Jun", value: 28000 },
  { label: "Jul", value: 34000 },
  { label: "Ago", value: 31000 },
  { label: "Set", value: 39000 },
  { label: "Out", value: 43000 },
  { label: "Nov", value: 48520 },
];
const customers = [
  { label: "Jun", value: 1420, comparison: 1100 },
  { label: "Jul", value: 1640, comparison: 1400 },
  { label: "Ago", value: 1580, comparison: 1300 },
  { label: "Set", value: 1900, comparison: 1600 },
  { label: "Out", value: 2240, comparison: 1850 },
  { label: "Nov", value: 2420, comparison: 2100 },
];
const orders = [
  { label: "Seg", value: 42 },
  { label: "Ter", value: 58 },
  { label: "Qua", value: 45 },
  { label: "Qui", value: 72 },
  { label: "Sex", value: 64 },
  { label: "Sáb", value: 38 },
];

export function Preview() {
  return (
    <div className="w-full max-w-5xl space-y-8">
      <section className="space-y-3">
        <h3 className="text-sm font-medium">Evolução com eixos</h3>
        <div className="grid gap-4 lg:grid-cols-3">
          <StatisticChartCard
            title="Receita mensal"
            description="Últimos seis meses"
            value="R$ 48.520"
            data={revenue}
            valueLabel="Receita"
            formatValue={(value) =>
              value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
            }
            trend={{
              label: "+12,8%",
              direction: "up",
              tone: "positive",
              description: "vs. mês anterior",
            }}
          />
          <StatisticChartCard
            title="Novos clientes"
            description="Comparativo anual"
            value="2.420"
            data={customers}
            chartType="line"
            valueLabel="2026"
            comparisonLabel="2025"
            trend={{
              label: "+15,2%",
              direction: "up",
              tone: "positive",
              description: "vs. ano anterior",
            }}
          />
          <StatisticChartCard
            title="Pedidos na semana"
            description="Segunda a sábado"
            value="319"
            data={orders}
            chartType="bar"
            valueLabel="Pedidos"
            trend={{
              label: "−3,2%",
              direction: "down",
              tone: "negative",
              description: "vs. semana anterior",
            }}
          />
        </div>
      </section>
      <section className="space-y-3">
        <h3 className="text-sm font-medium">Compactos e sparklines</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatisticChartCard
            layout="compact"
            title="Clientes"
            value="36.358"
            chartStyle="sparkline"
            data={customers.map(({ label, value }) => ({ label, value }))}
            showLegend={false}
            color="var(--chart-2)"
            trend={{ label: "+9%", direction: "up", tone: "positive" }}
          />
          <StatisticChartCard
            layout="compact"
            title="Projetos"
            value="78.298"
            chartStyle="sparkline"
            chartType="bar"
            data={orders}
            color="var(--chart-2)"
            trend={{ label: "+9%", direction: "up", tone: "positive" }}
          />
          <StatisticChartCard
            layout="compact"
            title="Crescimento"
            value="24%"
            chartStyle="sparkline"
            data={revenue}
            color="var(--chart-3)"
            trend={{ label: "+4 p.p.", direction: "up", tone: "positive" }}
          />
          <StatisticChartCard
            layout="compact"
            title="Despesas"
            value="R$ 10.230"
            chartStyle="sparkline"
            chartType="line"
            data={[...revenue].toReversed()}
            color="var(--chart-4)"
            trend={{ label: "−6,2%", direction: "down", tone: "positive" }}
          />
        </div>
      </section>
      <section className="space-y-3">
        <h3 className="text-sm font-medium">Cabeçalho com valor e comparação empilhada</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <StatisticChartCard
            layout="inline"
            title="Clientes"
            description="Últimos 7 dias"
            value="6.380"
            chartStyle="sparkline"
            data={customers.map(({ label, value }) => ({ label, value }))}
            showLegend={false}
            color="var(--chart-2)"
            footer="6.380 neste período · 4.298 na semana anterior"
            trend={{ label: "+26,5%", direction: "up", tone: "positive" }}
          />
          <StatisticChartCard
            layout="inline"
            title="Pagamentos"
            description="Últimos 7 dias"
            value="12.389"
            chartStyle="sparkline"
            chartType="bar"
            stacked
            showLegend
            data={customers}
            valueLabel="Pix"
            comparisonLabel="Cartão"
            color="var(--chart-1)"
            comparisonColor="var(--chart-2)"
            trend={{ label: "+26,5%", direction: "up", tone: "positive" }}
          />
        </div>
      </section>
    </div>
  );
}
