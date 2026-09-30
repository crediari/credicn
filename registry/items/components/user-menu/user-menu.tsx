"use client";

import {
  ChevronDown,
  ChevronRight,
  LayoutGrid,
  LogOut,
  Monitor,
  Moon,
  Palette,
  Pencil,
  ShieldCheck,
  Sun,
  UserRound,
  UsersRound,
} from "lucide-react";
import { useId, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

import { UserAvatar } from "../user-avatar/user-avatar";

type UserMenuTheme = "light" | "dark" | "system";
type UserMenuVariant = "compact" | "default" | "sidebar";

type UserMenuUser = {
  name?: string;
  email?: string;
  avatar?: string | null;
};

type UserMenuProps = {
  user?: UserMenuUser;
  variant?: UserMenuVariant;
  theme?: UserMenuTheme;
  defaultTheme?: UserMenuTheme;
  onThemeChange?: (theme: UserMenuTheme) => void;
  onLogout?: () => void | Promise<void>;
  profileHref?: string;
  securityHref?: string;
  applicationsHref?: string;
  adminUsersHref?: string;
  canAdminister?: boolean;
};

const themes = [
  { value: "light", label: "Tema claro", icon: Sun },
  { value: "dark", label: "Tema escuro", icon: Moon },
  { value: "system", label: "Tema do sistema", icon: Monitor },
] as const;

function UserMenu({
  user,
  variant = "default",
  theme: themeProp,
  defaultTheme = "system",
  onThemeChange,
  onLogout,
  profileHref = "/profile",
  securityHref = "/security",
  applicationsHref = "/apps",
  adminUsersHref = "/admin/users",
  canAdminister = false,
}: UserMenuProps) {
  const [uncontrolledTheme, setUncontrolledTheme] = useState<UserMenuTheme>(defaultTheme);
  const theme = themeProp ?? uncontrolledTheme;
  const themeLabelId = useId();
  const firstName = user?.name?.trim().split(/\s+/)[0];
  const isCompact = variant === "compact";
  const isSidebar = variant === "sidebar";
  const TriggerChevron = isSidebar ? ChevronRight : ChevronDown;

  function handleThemeChange(value: unknown) {
    if (value !== "light" && value !== "dark" && value !== "system") {
      return;
    }

    if (themeProp === undefined) {
      setUncontrolledTheme(value);
    }

    onThemeChange?.(value);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            aria-label="Abrir menu da conta"
            className={cn(
              "group shrink-0 data-popup-open:bg-accent",
              isCompact && "size-11 rounded-full border border-border/80 bg-muted/40 p-1",
              variant === "default" &&
                "h-11 gap-2 rounded-full border border-border/80 bg-muted/40 p-1 sm:pr-3",
              isSidebar && "h-auto w-full justify-start gap-3 rounded-xl p-2 text-left",
            )}
          />
        }
      >
        <UserAvatar
          userimage={user?.avatar}
          username={user?.name}
          className="size-9 shrink-0 select-none"
        />
        {!isCompact && !isSidebar && (
          <span className="hidden max-w-28 truncate text-sm font-medium sm:block">
            {firstName || "Minha conta"}
          </span>
        )}
        {isSidebar && (
          <span className="flex min-w-0 flex-1 flex-col items-start">
            <span className="w-full truncate text-sm font-medium">
              {user?.name || "Minha conta"}
            </span>
            {user?.email && (
              <span className="w-full truncate text-xs text-muted-foreground">{user.email}</span>
            )}
          </span>
        )}
        {!isCompact && (
          <TriggerChevron
            className={cn(
              "size-4 shrink-0 text-muted-foreground",
              !isSidebar && "hidden transition-transform group-data-popup-open:rotate-180 sm:block",
              isSidebar && "ml-auto",
            )}
          />
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align={isSidebar ? "start" : "end"}
        side={isSidebar ? "right" : "bottom"}
        sideOffset={isSidebar ? 8 : 10}
        className="w-80 max-w-[calc(100vw-1.5rem)] rounded-2xl border border-border/60 bg-popover p-3 shadow-xl ring-0"
      >
        <div className="flex flex-col items-center px-3 pt-3 pb-5 text-center">
          <a
            href={profileHref}
            aria-label="Editar perfil pessoal"
            title="Editar perfil pessoal"
            className="group/avatar relative mb-3 rounded-full focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            <UserAvatar
              userimage={user?.avatar}
              username={user?.name}
              className="size-16 shrink-0 ring-4 ring-background"
              textSize="text-xl"
            />
            <span
              aria-hidden="true"
              className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition-opacity group-hover/avatar:opacity-100 group-focus-visible/avatar:opacity-100"
            >
              <Pencil className="size-5" />
            </span>
          </a>
          <p className="w-full text-base leading-snug font-semibold wrap-anywhere">{user?.name}</p>
          <p className="mt-1 w-full text-xs leading-relaxed wrap-anywhere text-muted-foreground">
            {user?.email}
          </p>
        </div>

        <DropdownMenuItem
          render={<a href={profileHref} />}
          className="min-h-11 gap-3 rounded-full border border-border/60 bg-background px-4 shadow-xs"
        >
          <UserRound className="size-4" />
          Minha conta
        </DropdownMenuItem>

        <DropdownMenuGroup
          className="my-3 rounded-2xl bg-muted/60 p-1.5"
          aria-label="Atalhos da conta"
        >
          <DropdownMenuItem
            render={<a href={securityHref} />}
            className="min-h-11 gap-3 rounded-xl px-3"
          >
            <ShieldCheck className="size-4" />
            Segurança
          </DropdownMenuItem>
          <DropdownMenuItem
            render={<a href={applicationsHref} />}
            className="min-h-11 gap-3 rounded-xl px-3"
          >
            <LayoutGrid className="size-4" />
            Minhas aplicações
          </DropdownMenuItem>
          {canAdminister && (
            <DropdownMenuItem
              render={<a href={adminUsersHref} />}
              className="min-h-11 gap-3 rounded-xl px-3"
            >
              <UsersRound className="size-4" />
              Gerenciar usuários
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="mx-1 my-3" />
        <div className="flex items-center justify-between gap-2 px-3 py-1">
          <span id={themeLabelId} className="flex items-center gap-3 text-sm font-medium">
            <Palette className="size-4 text-muted-foreground" />
            Tema
          </span>
          <DropdownMenuRadioGroup
            aria-labelledby={themeLabelId}
            value={theme}
            onValueChange={handleThemeChange}
            className="flex items-center gap-0.5 rounded-full bg-muted p-1"
          >
            {themes.map(({ value, label, icon: Icon }) => (
              <DropdownMenuRadioItem
                key={value}
                value={value}
                label={label}
                aria-label={label}
                title={label}
                className="size-9 cursor-pointer justify-center rounded-full p-0 text-muted-foreground transition-colors focus-visible:ring-2 focus-visible:ring-ring data-checked:bg-background data-checked:text-foreground data-checked:shadow-sm [&>[data-slot=dropdown-menu-radio-item-indicator]]:hidden"
              >
                <Icon className="size-4" />
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </div>

        <DropdownMenuSeparator className="mx-1 mt-3 mb-3" />
        <DropdownMenuItem
          variant="destructive"
          onClick={() => void onLogout?.()}
          className="min-h-11 justify-center gap-2 rounded-full border border-border bg-background shadow-xs"
        >
          <LogOut className="size-4" />
          Sair da conta
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export {
  UserMenu,
  type UserMenuProps,
  type UserMenuTheme,
  type UserMenuUser,
  type UserMenuVariant,
};
