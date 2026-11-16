"use client";

import { CreditCard, ShoppingBag, Users, Wallet } from "lucide-react";

import { StatisticCard } from "./statistic-card";

export function Preview() {
  return (
    <div className="grid w-full max-w-4xl gap-4 sm:grid-cols-2">
      <StatisticCard
        title="Receita total"
        description="Novembro de 2026"
        value="R$ 48.520"
        icon={<Wallet />}
        trend={{
          label: "+12,8%",
          direction: "up",
          tone: "positive",
          description: "vs. mês anterior",
        }}
        footer="Atualizado há 5 minutos"
      />
      <StatisticCard
        title="Novos clientes"
        description="Últimos 30 dias"
        value="2.420"
        icon={<Users />}
        trend={{
          label: "+8,2%",
          direction: "up",
          tone: "positive",
          description: "vs. período anterior",
        }}
        footer="186 clientes nesta semana"
      />
      <StatisticCard
        title="Despesas operacionais"
        description="Novembro de 2026"
        value="R$ 18.940"
        icon={<CreditCard />}
        trend={{
          label: "−4,3%",
          direction: "down",
          tone: "positive",
          description: "vs. mês anterior",
        }}
        footer="Dentro do orçamento previsto"
      />
      <StatisticCard
        title="Cancelamentos"
        description="Últimos 30 dias"
        value="38"
        icon={<ShoppingBag />}
        trend={{
          label: "+2,1%",
          direction: "up",
          tone: "negative",
          description: "vs. período anterior",
        }}
        footer="Acompanhe os motivos no relatório"
      />
      <StatisticCard
        layout="inline"
        title="Pedidos"
        description="Últimos 7 dias"
        value="6.380"
        trend={{ label: "+26,5%", direction: "up", tone: "positive" }}
      />
      <StatisticCard
        layout="inline"
        title="Saldo disponível"
        description="Atualizado agora"
        value="R$ 12.389"
        trend={{ label: "Estável", direction: "flat", tone: "neutral" }}
      />
      <StatisticCard
        layout="compact"
        title="Taxa de conversão"
        value="24,6%"
        trend={{ label: "+3,1 p.p.", direction: "up", tone: "positive" }}
      />
      <StatisticCard
        layout="compact"
        title="Tempo médio"
        value="4 min"
        trend={{ label: "−18%", direction: "down", tone: "positive" }}
      />
    </div>
  );
}
