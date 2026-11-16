"use client";

import { CreditCard, ShoppingBag, TrendingUp, Users, Wallet } from "lucide-react";

import { StatisticSummaryCard } from "./statistic-summary-card";

export function Preview() {
  return (
    <div className="w-full max-w-5xl space-y-6">
      <StatisticSummaryCard
        aria-label="Resumo comercial"
        items={[
          {
            id: "orders",
            title: "Pedidos",
            value: "1.286",
            description: "Últimos 7 dias",
            icon: <ShoppingBag />,
            trend: { label: "+12,8%", direction: "up", tone: "positive" },
          },
          {
            id: "sales",
            title: "Vendas",
            value: "R$ 48.520",
            description: "Últimos 7 dias",
            icon: <Wallet />,
            trend: { label: "+8,2%", direction: "up", tone: "positive" },
          },
          {
            id: "profit",
            title: "Lucro",
            value: "R$ 18.940",
            description: "Últimos 7 dias",
            icon: <TrendingUp />,
            trend: { label: "+4,3%", direction: "up", tone: "positive" },
          },
          {
            id: "cost",
            title: "Despesas",
            value: "R$ 12.389",
            description: "Últimos 7 dias",
            icon: <CreditCard />,
            trend: { label: "−2,1%", direction: "down", tone: "positive" },
          },
        ]}
      />
      <StatisticSummaryCard
        columns={3}
        aria-label="Resumo da plataforma"
        items={[
          {
            id: "users",
            title: "Usuários ativos",
            value: "6.380",
            icon: <Users />,
            trend: { label: "+26,5%", direction: "up", tone: "positive" },
          },
          {
            id: "conversion",
            title: "Conversão",
            value: "24,6%",
            trend: { label: "+3,1 p.p.", direction: "up", tone: "positive" },
          },
          {
            id: "retention",
            title: "Retenção",
            value: "96,8%",
            trend: { label: "Estável", direction: "flat", tone: "neutral" },
          },
        ]}
      />
    </div>
  );
}
