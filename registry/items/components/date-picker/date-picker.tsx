"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { useState } from "react";
import type { DateRange } from "react-day-picker";

import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
type DatePickerBaseProps = {
  position?: "top" | "right" | "bottom" | "left";
  className?: string;
  placeholder?: string;
};
type DefaultDatePickerProps = DatePickerBaseProps & {
  type?: "default";
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
};
type RangeDatePickerProps = DatePickerBaseProps & {
  type: "range";
  value: DateRange | undefined;
  onChange: (range: DateRange | undefined) => void;
};
type DatePickerProps = DefaultDatePickerProps | RangeDatePickerProps;
function DatePicker(props: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const isRange = props.type === "range";
  const isEmpty = isRange ? !props.value?.from : !props.value;
  const placeholder =
    props.placeholder ?? (isRange ? "Selecione um intervalo de datas..." : "Selecione a data...");
  const formattedValue = (() => {
    if (isRange) {
      if (!props.value?.from) return null;
      if (!props.value.to) return format(props.value.from, "dd/LL/y", { locale: ptBR });
      return `${format(props.value.from, "dd/LL/y", { locale: ptBR })} – ${format(props.value.to, "dd/LL/y", { locale: ptBR })}`;
    }
    return props.value ? format(props.value, "PPP", { locale: ptBR }) : null;
  })();
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          data-empty={isEmpty}
          className={cn(
            "flex h-9 w-full min-w-0 items-center justify-start gap-2 rounded-3xl border border-transparent bg-input/50 px-3 py-2 text-left text-sm font-normal text-foreground transition-[color,box-shadow,background-color] outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 data-[empty=true]:text-muted-foreground [&_svg]:size-4 [&_svg]:shrink-0",
            props.className,
          )}
        >
          <CalendarIcon />
          {formattedValue ?? <span>{placeholder}</span>}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="center" side={props.position}>
        {props.type === "range" ? (
          <Calendar
            mode="range"
            defaultMonth={props.value?.from}
            selected={props.value}
            onSelect={props.onChange}
            numberOfMonths={2}
            locale={ptBR}
          />
        ) : (
          <Calendar
            mode="single"
            defaultMonth={props.value}
            selected={props.value}
            captionLayout="dropdown"
            disabled={(date) => date > new Date()}
            onSelect={(date) => {
              props.onChange(date);
              setOpen(false);
            }}
            locale={ptBR}
          />
        )}
      </PopoverContent>
    </Popover>
  );
}
export { DatePicker, type DatePickerProps, type DefaultDatePickerProps, type RangeDatePickerProps };
