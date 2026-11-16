"use client";

import { ChartPie } from "lucide-react";

import { StatisticBreakdownCard } from "./statistic-breakdown-card";

export function Preview() {
  return (
    <div className="grid w-full max-w-2xl gap-4 sm:grid-cols-2">
      <StatisticBreakdownCard
        title="Receita por canal"
        description="Novembro de 2026"
        icon={<ChartPie />}
        centerLabel="Canais"
        data={[
          { label: "Filiais", value: 28500 },
          { label: "Digital", value: 14200 },
          { label: "Parceiros", value: 5820 },
        ]}
        formatValue={(value) =>
          value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
            maximumFractionDigits: 0,
          })
        }
        footer="Participação sobre a receita do mês"
      />
      <StatisticBreakdownCard
        title="Carteira de contratos"
        description="Distribuição por status"
        icon={<ChartPie />}
        centerLabel="Contratos"
        data={[
          { label: "Em dia", value: 840 },
          { label: "Em negociação", value: 260 },
          { label: "Em atraso", value: 150 },
          { label: "Em análise", value: 50 },
        ]}
        footer="1.300 contratos na carteira ativa"
      />
      <StatisticBreakdownCard
        variant="stacked"
        title="Ativos totais"
        value="R$ 478.230,90"
        description="Distribuição da receita"
        trend={{
          label: "+14,6%",
          direction: "up",
          tone: "positive",
          description: "vs. ano anterior",
        }}
        data={[
          { label: "Venda de produtos", value: 312500.45 },
          { label: "Serviços", value: 125000.25 },
          { label: "Outras receitas", value: 40730.2 },
        ]}
        formatValue={(value) =>
          value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
        }
      />
      <StatisticBreakdownCard
        variant="stacked"
        title="Alocação do orçamento"
        description="Planejamento do trimestre"
        data={[
          { label: "Operação", value: 150000 },
          { label: "Tecnologia", value: 60000 },
          { label: "Marketing", value: 30000 },
        ]}
        value="R$ 240.000"
        formatValue={(value) =>
          value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
            maximumFractionDigits: 0,
          })
        }
        footer="Distribuição do orçamento do trimestre"
      />
      <StatisticBreakdownCard
        layout="compact"
        title="Despesas"
        value="R$ 10.230"
        showLegend={false}
        centerLabel="Categorias"
        data={[
          { label: "Operação", value: 54 },
          { label: "Pessoal", value: 28 },
          { label: "Outros", value: 18 },
        ]}
      />
      <StatisticBreakdownCard
        layout="inline"
        title="Produtos"
        description="Últimos 7 dias"
        value="12.389"
        showLegend={false}
        centerLabel="Produtos"
        data={[
          { label: "Concluídos", value: 68 },
          { label: "Em andamento", value: 25 },
          { label: "Pendentes", value: 7 },
        ]}
        footer="R$ 18 mil a mais de lucro neste mês"
        trend={{ label: "+26,5%", direction: "up", tone: "positive" }}
      />
    </div>
  );
}
