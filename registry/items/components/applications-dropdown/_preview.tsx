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
        { id: "credito", name: "Credit", url: "#" },
        { id: "cobranca", name: "Collections", url: "#" },
        { id: "relatorios", name: "Reports", url: "#" },
        { id: "clientes", name: "Customers", url: "#" },
        { id: "propostas", name: "Proposals", url: "#" },
        { id: "financeiro", name: "Finance", url: "#" },
        { id: "assinaturas", name: "Signatures", url: "#" },
        { id: "atendimento", name: "Support", url: "#" },
      ]}
      tools={[
        { id: "docs", name: "Documentation", url: "#" },
        { id: "design", name: "Design System", url: "#" },
        { id: "analytics", name: "Analytics", url: "#" },
        { id: "status", name: "Status", url: "#" },
        { id: "suporte", name: "Support", url: "#" },
        { id: "monitoramento", name: "Monitoring", url: "#" },
      ]}
    />
  );
}
