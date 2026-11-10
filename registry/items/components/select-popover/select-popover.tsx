"use client";

import { ChevronDown, Loader2, SearchX, XCircle } from "lucide-react";
import { Popover as PopoverPrimitive } from "radix-ui";
import type { ComponentProps, ReactNode } from "react";
import { useId, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Command, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
type SelectPopoverItemState = {
  selected: boolean;
};
type SelectPopoverBaseProps<T> = {
  portalContainer?: HTMLElement | null;
  items: readonly T[];
  getItemValue: (item: NoInfer<T>) => string | number;
  getItemLabel: (item: NoInfer<T>) => string;
  getItemKeywords?: (item: NoInfer<T>) => readonly string[];
  renderItem?: (item: NoInfer<T>, state: SelectPopoverItemState) => ReactNode;
  isItemDisabled?: (item: NoInfer<T>) => boolean;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: ReactNode;
  loadingMessage?: ReactNode;
  errorMessage?: ReactNode;
  isLoading?: boolean;
  isError?: boolean;
  disabled?: boolean;
  searchable?: boolean;
  shouldFilter?: boolean;
  resultLimit?: number;
  searchValue?: string;
  onSearchValueChange?: (value: string) => void;
  resetSearchOnClose?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  triggerClassName?: string;
  triggerId?: string;
  contentClassName?: string;
  listClassName?: string;
};
type SelectPopoverSingleProps<T> = SelectPopoverBaseProps<T> & {
  multiple?: false;
  value: NoInfer<T> | null;
  onValueChange: (value: NoInfer<T> | null) => void;
  renderValue?: (value: NoInfer<T>) => ReactNode;
  allowDeselect?: boolean;
  clearLabel?: string;
  closeOnSelect?: boolean;
};
type SelectPopoverMultipleProps<T> = SelectPopoverBaseProps<T> & {
  multiple: true;
  value: readonly NoInfer<T>[];
  onValueChange: (value: NoInfer<T>[]) => void;
  renderValue?: (value: readonly NoInfer<T>[]) => ReactNode;
  closeOnSelect?: boolean;
};
type SelectPopoverProps<T> = SelectPopoverSingleProps<T> | SelectPopoverMultipleProps<T>;
function SelectPopover<T>(props: SelectPopoverProps<T>) {
  const {
    portalContainer,
    items,
    getItemValue,
    getItemLabel,
    getItemKeywords,
    renderItem,
    isItemDisabled,
    placeholder = "Selecionar...",
    searchPlaceholder = "Pesquisar...",
    emptyMessage = "Nenhum resultado encontrado",
    loadingMessage = "Buscando...",
    errorMessage = "Erro ao carregar",
    isLoading = false,
    isError = false,
    disabled = false,
    searchable = true,
    shouldFilter = true,
    resultLimit = 100,
    searchValue,
    onSearchValueChange,
    resetSearchOnClose = true,
    open: controlledOpen,
    onOpenChange,
    className,
    triggerClassName,
    triggerId,
    contentClassName,
    listClassName,
  } = props;
  const [internalOpen, setInternalOpen] = useState(false);
  const [internalSearch, setInternalSearch] = useState("");
  const listId = useId();
  const open = controlledOpen ?? internalOpen;
  const search = searchValue ?? internalSearch;
  const selectedItems = props.multiple ? props.value : props.value ? [props.value] : [];
  const selectedValues = new Set(selectedItems.map((item) => String(getItemValue(item))));
  const filteredItems = useMemo(() => {
    if (!shouldFilter || !search.trim()) {
      return items;
    }
    const normalizedSearch = normalizeSearch(search);
    return items.filter((item) => {
      const searchableText = [getItemLabel(item), ...(getItemKeywords?.(item) ?? [])].join(" ");
      return normalizeSearch(searchableText).includes(normalizedSearch);
    });
  }, [getItemKeywords, getItemLabel, items, search, shouldFilter]);
  const normalizedLimit = Number.isFinite(resultLimit)
    ? Math.max(1, Math.floor(resultLimit))
    : filteredItems.length;
  const visibleItems = filteredItems.slice(0, normalizedLimit);
  const hiddenResultCount = filteredItems.length - visibleItems.length;
  function handleOpenChange(nextOpen: boolean) {
    if (controlledOpen === undefined) {
      setInternalOpen(nextOpen);
    }
    onOpenChange?.(nextOpen);
    if (!nextOpen && resetSearchOnClose) {
      handleSearchChange("");
    }
  }
  function handleSearchChange(nextSearch: string) {
    if (searchValue === undefined) {
      setInternalSearch(nextSearch);
    }
    onSearchValueChange?.(nextSearch);
  }
  function handleItemSelect(item: T) {
    const itemValue = String(getItemValue(item));
    const isSelected = selectedValues.has(itemValue);
    if (props.multiple) {
      const nextValue = isSelected
        ? props.value.filter((selectedItem) => String(getItemValue(selectedItem)) !== itemValue)
        : [...props.value, item];
      props.onValueChange(nextValue);
      if (props.closeOnSelect) {
        handleOpenChange(false);
      }
      return;
    }
    props.onValueChange(isSelected && props.allowDeselect ? null : item);
    if (props.closeOnSelect ?? true) {
      handleOpenChange(false);
    }
  }
  function renderSelectedValue() {
    if (props.multiple) {
      if (props.value.length === 0) {
        return <span className="text-muted-foreground">{placeholder}</span>;
      }
      if (props.renderValue) {
        return props.renderValue(props.value);
      }
      if (props.value.length === 1) {
        return getItemLabel(props.value[0]);
      }
      return `${props.value.length} selecionados`;
    }
    if (!props.value) {
      return <span className="text-muted-foreground">{placeholder}</span>;
    }
    return props.renderValue ? props.renderValue(props.value) : getItemLabel(props.value);
  }
  return (
    <div className={cn("w-full", className)}>
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger disabled={disabled} asChild>
          <Button
            variant="outline"
            id={triggerId}
            role="combobox"
            aria-expanded={open}
            aria-controls={listId}
            className={cn(
              "h-10 w-full justify-between gap-2 border! border-transparent! bg-input/50 dark:bg-input/50",
              triggerClassName,
            )}
          >
            <div className="min-w-0 flex-1 truncate text-left">{renderSelectedValue()}</div>
            <ChevronDown
              className={cn(
                "size-4 shrink-0 opacity-50 transition-transform",
                open && "rotate-180",
              )}
            />
          </Button>
        </PopoverTrigger>

        <SelectPopoverContent
          container={portalContainer}
          onWheelCapture={(event) => event.stopPropagation()}
          onTouchMoveCapture={(event) => event.stopPropagation()}
          align="start"
          className={cn("w-(--radix-popover-trigger-width) gap-0 p-0", contentClassName)}
        >
          <Command shouldFilter={false}>
            {searchable && (
              <CommandInput
                aria-label={searchPlaceholder}
                placeholder={searchPlaceholder}
                onValueChange={handleSearchChange}
                value={search}
              />
            )}

            <CommandList
              id={listId}
              aria-multiselectable={props.multiple || undefined}
              className={cn("p-1", listClassName)}
            >
              {!props.multiple && props.clearLabel && (
                <CommandItem
                  value="__clear_selection__"
                  data-checked={props.value === null}
                  aria-selected={props.value === null}
                  onSelect={() => {
                    props.onValueChange(null);
                    handleOpenChange(false);
                  }}
                  className="min-h-10 py-2"
                >
                  {props.clearLabel}
                </CommandItem>
              )}
              {isLoading ? (
                <SelectPopoverStatus icon={<Loader2 className="animate-spin" />}>
                  {loadingMessage}
                </SelectPopoverStatus>
              ) : isError ? (
                <SelectPopoverStatus icon={<XCircle />}>{errorMessage}</SelectPopoverStatus>
              ) : visibleItems.length === 0 ? (
                props.multiple || !props.clearLabel ? (
                  <SelectPopoverStatus icon={<SearchX />}>{emptyMessage}</SelectPopoverStatus>
                ) : null
              ) : (
                visibleItems.map((item) => {
                  const itemValue = String(getItemValue(item));
                  const isSelected = selectedValues.has(itemValue);
                  return (
                    <CommandItem
                      key={itemValue}
                      value={itemValue}
                      disabled={isItemDisabled?.(item)}
                      data-checked={isSelected}
                      aria-selected={isSelected}
                      onSelect={() => handleItemSelect(item)}
                      className="min-h-10 py-2"
                    >
                      <div className="min-w-0 flex-1">
                        {renderItem
                          ? renderItem(item, { selected: isSelected })
                          : getItemLabel(item)}
                      </div>
                    </CommandItem>
                  );
                })
              )}
            </CommandList>

            {!isLoading && !isError && hiddenResultCount > 0 && (
              <div className="border-t px-3 py-2 text-xs text-muted-foreground">
                Mostrando {visibleItems.length} de {filteredItems.length} resultados. Refine a busca
                para ver mais.
              </div>
            )}
          </Command>
        </SelectPopoverContent>
      </Popover>
    </div>
  );
}
function SelectPopoverContent({
  container,
  className,
  ...props
}: ComponentProps<typeof PopoverContent> & { container?: HTMLElement | null }) {
  if (!container) return <PopoverContent className={className} {...props} />;

  return (
    <PopoverPrimitive.Portal container={container}>
      <PopoverPrimitive.Content
        data-slot="popover-content"
        sideOffset={4}
        className={cn(
          "z-50 flex origin-(--radix-popover-content-transform-origin) flex-col rounded-3xl bg-popover text-sm text-popover-foreground shadow-lg ring-1 ring-foreground/5 outline-hidden duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 dark:ring-foreground/10 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
          className,
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  );
}

function SelectPopoverStatus({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 px-4 py-8 text-center text-sm text-muted-foreground">
      <span className="[&_svg]:size-5" aria-hidden="true">
        {icon}
      </span>
      {children}
    </div>
  );
}
function normalizeSearch(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/gu, "")
    .toLocaleLowerCase()
    .trim();
}
export {
  SelectPopover,
  type SelectPopoverItemState,
  type SelectPopoverMultipleProps,
  type SelectPopoverProps,
  type SelectPopoverSingleProps,
};
