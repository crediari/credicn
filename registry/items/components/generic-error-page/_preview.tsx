"use client";

import { useState } from "react";

import { GenericErrorPage, type ErrorPageVariant } from "./generic-error-page";

const variants: { label: string; value: ErrorPageVariant }[] = [
  { label: "Genérico", value: "generic" },
  { label: "404", value: "not-found" },
  { label: "500", value: "server-error" },
  { label: "403", value: "forbidden" },
  { label: "401", value: "unauthorized" },
  { label: "Offline", value: "offline" },
  { label: "Manutenção", value: "maintenance" },
];

export function Preview() {
  const [variant, setVariant] = useState<ErrorPageVariant>("not-found");

  return (
    <div className="w-full">
      <div className="mx-auto flex max-w-3xl flex-wrap justify-center gap-2 px-4 pt-5">
        {variants.map((item) => (
          <button
            className="rounded-full border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted data-[active=true]:border-primary data-[active=true]:bg-primary data-[active=true]:text-primary-foreground"
            data-active={variant === item.value}
            key={item.value}
            onClick={() => setVariant(item.value)}
            type="button"
          >
            {item.label}
          </button>
        ))}
      </div>

      <GenericErrorPage
        variant={variant}
        buttons={[
          { label: "Voltar ao início", url: "#" },
          { label: "Tentar novamente", url: "#", variant: "outline" },
        ]}
      />
    </div>
  );
}
