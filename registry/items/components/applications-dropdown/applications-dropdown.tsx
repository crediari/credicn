"use client";

import { Grip, Image, Search, SearchX, ToolCase, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

import { UserAvatar } from "../user-avatar/user-avatar";

type ApplicationItem = {
  id: string;
  name: string;
  url: string;
  logoUrl?: string | null;
};

type ApplicationsDropdownUser = {
  name?: string;
  avatar?: string | null;
};

type ApplicationsDropdownProps = {
  systems?: ApplicationItem[];
  tools?: ApplicationItem[];
  isLoading?: boolean;
  accountUrl?: string;
  user?: ApplicationsDropdownUser;
};

function ApplicationsDropdown({
  systems = [],
  tools = [],
  isLoading = false,
  accountUrl = "#",
  user,
}: ApplicationsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [search, setSearch] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const hasApps = systems.length > 0 || tools.length > 0;
  const normalizedSearch = normalizeSearch(search);
  const filteredSystems = filterApplications(systems, normalizedSearch);
  const filteredTools = filterApplications(tools, normalizedSearch);
  const showAccount =
    !normalizedSearch || normalizeSearch(`Conta ${user?.name ?? ""}`).includes(normalizedSearch);
  const hasSearchResults = showAccount || filteredSystems.length > 0 || filteredTools.length > 0;

  useEffect(() => {
    if (isSearchOpen) {
      searchInputRef.current?.focus();
    }
  }, [isSearchOpen]);

  function handleOpenChange(open: boolean) {
    setIsOpen(open);

    if (!open) {
      setIsSearchOpen(false);
      setSearch("");
    }
  }

  function toggleSearch() {
    if (isSearchOpen) {
      setSearch("");
    }

    setIsSearchOpen(!isSearchOpen);
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="sm"
            className="size-10 rounded-full p-1"
            aria-label="Apps da empresa"
          />
        }
      >
        <Grip className="size-5 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="bottom"
        align="end"
        className="w-[min(32rem,calc(100vw-2rem))] overflow-hidden p-4"
        sideOffset={8}
      >
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <h3 className="text-sm font-medium">CrediSIS CrediAri Apps</h3>
            <p className="text-xs text-muted-foreground">Seus apps corporativos em um só lugar</p>
          </div>

          {!isLoading && hasApps && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="-mt-1 size-8 shrink-0"
              aria-label={isSearchOpen ? "Fechar busca" : "Buscar apps e ferramentas"}
              aria-expanded={isSearchOpen}
              onClick={toggleSearch}
            >
              {isSearchOpen ? <X className="size-4" /> : <Search className="size-4" />}
            </Button>
          )}
        </div>

        {isSearchOpen && (
          <div className="relative mb-4">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              ref={searchInputRef}
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              onKeyDown={(event) => {
                if (event.key !== "Escape") {
                  event.stopPropagation();
                }
              }}
              placeholder="Buscar apps e ferramentas..."
              aria-label="Buscar apps e ferramentas"
              className="h-9 pl-9"
            />
          </div>
        )}

        {isLoading ? (
          <div className="p-6 text-center text-sm text-muted-foreground">Carregando apps...</div>
        ) : !hasApps ? (
          <div className="mt-4 flex flex-col p-8 text-center text-sm text-muted-foreground">
            <span className="mx-auto mb-3 flex rounded-full bg-muted p-2">
              <ToolCase className="size-7 text-muted-foreground" />
            </span>
            Os apps que você tiver acesso irão aparecer aqui...
          </div>
        ) : !hasSearchResults ? (
          <div className="flex flex-col items-center p-8 text-center text-sm text-muted-foreground">
            <span className="mb-3 flex rounded-full bg-muted p-2">
              <SearchX className="size-6" />
            </span>
            Nenhum app encontrado para “{search.trim()}”.
          </div>
        ) : (
          <ScrollArea className="h-[min(22rem,calc(var(--available-height)-8rem))]">
            <div className="space-y-4 pr-3">
              {(showAccount || filteredSystems.length > 0) && (
                <div className="grid grid-cols-4 gap-2">
                  {showAccount && (
                    <a
                      className="flex aspect-square w-full flex-col items-center justify-center rounded-2xl p-3 transition-colors hover:bg-muted"
                      href={accountUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <div className="flex flex-col items-center gap-1">
                        <UserAvatar
                          userimage={user?.avatar}
                          username={user?.name}
                          className="rounded-full"
                        />
                        <span className="text-center text-xs leading-tight font-medium">Conta</span>
                      </div>
                    </a>
                  )}

                  {filteredSystems.map((app) => (
                    <ApplicationCard key={app.id} app={app} />
                  ))}
                </div>
              )}

              {filteredTools.length > 0 && (
                <div>
                  <p className="mb-2 px-1 text-xs font-semibold text-muted-foreground">
                    Ferramentas
                  </p>
                  <div className="grid grid-cols-4 gap-2">
                    {filteredTools.map((app) => (
                      <ApplicationCard key={app.id} app={app} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ApplicationCard({ app }: { app: ApplicationItem }) {
  return (
    <DropdownMenuItem
      className="flex aspect-square w-full flex-col items-center justify-center overflow-hidden rounded-2xl p-3 transition-colors hover:bg-muted"
      render={<a href={app.url} target="_blank" rel="noreferrer" />}
    >
      <div className="flex flex-col items-center gap-1">
        {app.logoUrl ? (
          <img src={app.logoUrl} alt="" className="w-6" />
        ) : (
          <Image className="size-5" />
        )}
        <span className="line-clamp-2 text-center text-xs leading-tight font-medium">
          {app.name}
        </span>
      </div>
    </DropdownMenuItem>
  );
}

function filterApplications(applications: ApplicationItem[], search: string) {
  if (!search) {
    return applications;
  }

  return applications.filter((application) => normalizeSearch(application.name).includes(search));
}

function normalizeSearch(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/gu, "")
    .toLocaleLowerCase("pt-BR")
    .trim();
}

export {
  ApplicationsDropdown,
  type ApplicationItem,
  type ApplicationsDropdownProps,
  type ApplicationsDropdownUser,
};
