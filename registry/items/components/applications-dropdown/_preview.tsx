"use client";

import { ApplicationsDropdown } from "./applications-dropdown";

export function Preview() {
  return (
    <ApplicationsDropdown
      user={{ name: "Ana Costa" }}
      accountUrl="#"
      systems={[
        { id: "cards", name: "Cards", url: "#" },
        { id: "intranet", name: "Intranet", url: "#" },
        { id: "credito", name: "Crédito", url: "#" },
        { id: "cobranca", name: "Cobrança", url: "#" },
        { id: "relatorios", name: "Relatórios", url: "#" },
        { id: "clientes", name: "Clientes", url: "#" },
        { id: "propostas", name: "Propostas", url: "#" },
        { id: "financeiro", name: "Financeiro", url: "#" },
        { id: "assinaturas", name: "Assinaturas", url: "#" },
        { id: "atendimento", name: "Atendimento", url: "#" },
      ]}
      tools={[
        { id: "docs", name: "Documentação", url: "#" },
        { id: "design", name: "Design System", url: "#" },
        { id: "analytics", name: "Analytics", url: "#" },
        { id: "status", name: "Status", url: "#" },
        { id: "suporte", name: "Suporte", url: "#" },
        { id: "monitoramento", name: "Monitoramento", url: "#" },
      ]}
    />
  );
}
