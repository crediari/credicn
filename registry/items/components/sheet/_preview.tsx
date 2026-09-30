"use client";

import { Button } from "@/components/ui/button";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./sheet";

export function Preview() {
  return (
    <Sheet>
      <SheetTrigger render={<Button variant="outline" />}>Abrir painel</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Configurações</SheetTitle>
          <SheetDescription>Ajuste as preferências desta área.</SheetDescription>
        </SheetHeader>

        <div className="px-6 text-sm text-muted-foreground">
          O conteúdo principal do painel pode incluir formulários, filtros ou detalhes adicionais.
        </div>

        <SheetFooter>
          <SheetClose render={<Button variant="outline" />}>Cancelar</SheetClose>
          <Button>Salvar alterações</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
