"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button, ButtonProps } from "@/components/ui/button";
import { Calendar, CalendarProps } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export type DatePickerProps = ButtonProps & {
  calendar?: CalendarProps&{
     placeholder?: string,
     display: string,
  }
};

export function DatePicker({ className, calendar, ...props }: DatePickerProps) {
  const date = calendar?.selected;
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            className,
            "justify-start text-left font-normal",
            !date && "text-muted-foreground",
          )}
          {...props}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {calendar?.display ? calendar.display : <span>{calendar?.placeholder??'Select Date'}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar {...calendar} />
      </PopoverContent>
    </Popover>
  );
}
