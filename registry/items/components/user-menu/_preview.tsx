"use client";

import { useState } from "react";

import { UserMenu, type UserMenuTheme } from "./user-menu";

export function Preview() {
  const [theme, setTheme] = useState<UserMenuTheme>("system");
  const sharedProps = {
    user: { name: "Ana Costa", email: "ana.costa@crediari.com.br" },
    theme,
    onThemeChange: setTheme,
    onLogout: () => undefined,
    canAdminister: true,
  };

  return (
    <div className="flex w-full max-w-2xl flex-col gap-8">
      <div className="flex flex-wrap items-end gap-8">
        <VariantPreview label="Default">
          <UserMenu {...sharedProps} />
        </VariantPreview>
        <VariantPreview label="Compact">
          <UserMenu {...sharedProps} variant="compact" />
        </VariantPreview>
      </div>

      <VariantPreview label="Sidebar">
        <div className="w-64 rounded-2xl border bg-muted/30 p-2">
          <UserMenu {...sharedProps} variant="sidebar" />
        </div>
      </VariantPreview>
    </div>
  );
}

function VariantPreview({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      {children}
    </div>
  );
}
