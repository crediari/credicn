"use client";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { useState } from "react";
import type { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
type DatePickerBaseProps = {
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
    props.placeholder ?? (isRange ? "Select a date range..." : "Select a date...");
  const formattedValue = (() => {
    if (isRange) {
      if (!props.value?.from) return null;
      if (!props.value.to) return format(props.value.from, "LL/dd/y", { locale: enUS });
      return `${format(props.value.from, "LL/dd/y", { locale: enUS })} – ${format(props.value.to, "LL/dd/y", { locale: enUS })}`;
    }
    return props.value ? format(props.value, "PPP", { locale: enUS }) : null;
  })();
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          data-empty={isEmpty}
          className={cn(
            "w-full justify-start text-left font-normal data-[empty=true]:text-muted-foreground",
            props.className,
          )}
        >
          <CalendarIcon />
          {formattedValue ?? <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="center">
        {props.type === "range" ? (
          <Calendar
            mode="range"
            defaultMonth={props.value?.from}
            selected={props.value}
            onSelect={props.onChange}
            numberOfMonths={2}
            locale={enUS}
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
            locale={enUS}
          />
        )}
      </PopoverContent>
    </Popover>
  );
}
export { DatePicker, type DatePickerProps, type DefaultDatePickerProps, type RangeDatePickerProps };
