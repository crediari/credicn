"use client";

import { ArrowDown, ArrowUp, ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

type DebtSortField = "name" | "pa" | "invoiceBill" | "delayedDays";
type SortOrder = "asc" | "desc";

type DebtTableRow = {
  id: string;
  name: string;
  account: string;
  pa: string;
  invoiceBill: number;
  delayedDays: number;
};

type DebtTableProps = {
  rows: DebtTableRow[];
  showPa?: boolean;
  loading?: boolean;
  error?: string | null;
  onRowClick?: (row: DebtTableRow) => void;
};

const severeDelayDays = 50;
const pageSizeOptions = [25, 50, 100] as const;

function formatCurrencyBRL(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function normalizeSearch(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/gu, "")
    .toLocaleLowerCase("pt-BR")
    .trim();
}

function SortableHeader({
  label,
  active,
  direction,
  sortable = true,
  onSort,
}: {
  label: string;
  active: boolean;
  direction: SortOrder;
  sortable?: boolean;
  onSort: () => void;
}) {
  const Icon = !active ? ArrowUpDown : direction === "asc" ? ArrowUp : ArrowDown;

  if (!sortable) {
    return (
      <TableHead className="px-2 py-1">
        <span className="px-2">{label}</span>
      </TableHead>
    );
  }

  return (
    <TableHead className="px-2 py-1">
      <Button type="button" variant="ghost" className="w-full justify-between" onClick={onSort}>
        <span>{label}</span>
        <Icon
          className={cn("size-3.5 shrink-0", active ? "text-primary" : "text-muted-foreground")}
        />
      </Button>
    </TableHead>
  );
}

function DebtTable({
  rows,
  showPa = true,
  loading = false,
  error = null,
  onRowClick,
}: DebtTableProps) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [sortColumn, setSortColumn] = useState<DebtSortField>("name");
  const [sortDirection, setSortDirection] = useState<SortOrder>("asc");
  const columnCount = showPa ? 5 : 4;

  const filteredRows = useMemo(() => {
    const query = normalizeSearch(search);
    const visible = rows.filter((row) => {
      if (!query) return true;
      const haystack = normalizeSearch(
        [row.name, row.account, showPa ? row.pa : ""].filter(Boolean).join(" "),
      );
      return haystack.includes(query);
    });

    return visible.toSorted((a, b) => {
      const direction = sortDirection === "asc" ? 1 : -1;
      if (sortColumn === "name" || sortColumn === "pa") {
        return a[sortColumn].localeCompare(b[sortColumn], "pt-BR") * direction;
      }
      return (a[sortColumn] - b[sortColumn]) * direction;
    });
  }, [rows, search, showPa, sortColumn, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageRows = filteredRows.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  function handleSort(column: DebtSortField) {
    if (sortColumn === column) {
      setSortDirection((current) => (current === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
    setPage(1);
  }

  return (
    <div className="flex w-full min-w-0 flex-col gap-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <Input
          className="w-full min-w-0 sm:mr-auto sm:max-w-md"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
          placeholder={showPa ? "Buscar por nome, conta ou PA" : "Buscar por nome ou conta"}
          aria-label={showPa ? "Buscar por nome, conta ou PA" : "Buscar por nome ou conta"}
        />
        <Select
          value={String(pageSize)}
          onValueChange={(value) => {
            const nextPageSize = Number(value);
            if (nextPageSize === 25 || nextPageSize === 50 || nextPageSize === 100) {
              setPageSize(nextPageSize);
              setPage(1);
            }
          }}
        >
          <SelectTrigger aria-label="Registros por página">
            <SelectValue placeholder="Registros por página" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {pageSizeOptions.map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size} por página
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="min-w-0 overflow-hidden rounded-3xl border">
        <Table>
          <TableHeader className="bg-muted/60">
            <TableRow>
              <SortableHeader
                label="Titular"
                active={sortColumn === "name"}
                direction={sortDirection}
                onSort={() => handleSort("name")}
              />
              <SortableHeader
                label="Conta"
                active={false}
                direction={sortDirection}
                sortable={false}
                onSort={() => undefined}
              />
              {showPa ? (
                <SortableHeader
                  label="PA"
                  active={sortColumn === "pa"}
                  direction={sortDirection}
                  onSort={() => handleSort("pa")}
                />
              ) : null}
              <SortableHeader
                label="Saldo"
                active={sortColumn === "invoiceBill"}
                direction={sortDirection}
                onSort={() => handleSort("invoiceBill")}
              />
              <SortableHeader
                label="Atraso"
                active={sortColumn === "delayedDays"}
                direction={sortDirection}
                onSort={() => handleSort("delayedDays")}
              />
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageRows.map((row) => (
              <TableRow
                key={row.id}
                className={cn(
                  onRowClick && "cursor-pointer",
                  row.delayedDays > severeDelayDays && "bg-destructive/12 hover:bg-destructive/18",
                )}
                tabIndex={onRowClick ? 0 : undefined}
                onClick={() => onRowClick?.(row)}
                onKeyDown={(event) => {
                  if (!onRowClick) return;
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onRowClick(row);
                  }
                }}
              >
                <TableCell className="max-w-xs truncate font-medium">{row.name}</TableCell>
                <TableCell>{row.account}</TableCell>
                {showPa ? <TableCell>{row.pa}</TableCell> : null}
                <TableCell>{formatCurrencyBRL(row.invoiceBill)}</TableCell>
                <TableCell>{row.delayedDays.toLocaleString("pt-BR")} dias</TableCell>
              </TableRow>
            ))}
            {!loading && !error && pageRows.length === 0 ? (
              <TableRow>
                <TableCell className="h-24 text-center text-muted-foreground" colSpan={columnCount}>
                  Nenhum registro encontrado.
                </TableCell>
              </TableRow>
            ) : null}
            {loading ? (
              <TableRow>
                <TableCell className="h-24 text-center text-muted-foreground" colSpan={columnCount}>
                  Carregando registros...
                </TableCell>
              </TableRow>
            ) : null}
            {error ? (
              <TableRow>
                <TableCell className="h-24 text-center text-destructive" colSpan={columnCount}>
                  {error}
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </div>

      {filteredRows.length > pageSize ? (
        <div className="mt-6 flex items-center justify-between">
          <span className="mr-2 text-sm">
            Encontrados <strong>{filteredRows.length}</strong> usuário(s)
          </span>
          <div className="flex items-center">
            <Button
              type="button"
              size="icon"
              disabled={currentPage === 1}
              onClick={() => setPage(Math.max(currentPage - 1, 1))}
              aria-label="Página anterior"
            >
              <ChevronLeft />
            </Button>
            <span className="mx-2">
              Página {currentPage} de {totalPages}
            </span>
            <Button
              type="button"
              size="icon"
              disabled={currentPage >= totalPages}
              onClick={() => setPage(Math.min(currentPage + 1, totalPages))}
              aria-label="Próxima página"
            >
              <ChevronRight />
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export { DebtTable, type DebtSortField, type DebtTableProps, type DebtTableRow, type SortOrder };
