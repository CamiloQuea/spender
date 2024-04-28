"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker";
import { api } from "@/trpc/react";
import { useZodForm } from "@/hooks/use-zod-form";
import { z } from "zod";
import {
  endOfMonth,
  format,
  startOfMonth,
  endOfDay,
  startOfDay,
  isValid,
} from "date-fns";

export default function Home() {
  const form = useZodForm({
    schema: z.object({
      dateRange: z.object({
        from: z.date().optional(),
        to: z.date().optional(),
      }),
    }),
    defaultValues: {
      dateRange: {
        from: startOfDay(startOfMonth(new Date())),
        to: endOfMonth(endOfMonth(new Date())),
      },
    },
  });

  const isDateRangeValid = () => {
    const from = form.getValues("dateRange.from");
    const to = form.getValues("dateRange.to");
    const isValidDate =
      typeof from !== "undefined" &&
      typeof to !== "undefined" &&
      isValid(from) &&
      isValid(to);
    return isValidDate;
  };

  const { data: spends } = api.spend.getAllByRange.useQuery(
    {
      from: form.getValues("dateRange.from")!,
      to: form.getValues("dateRange.to")!,
    },
    {
      enabled: isDateRangeValid(),
    },
  );
  const { data: totalMonth } = api.spend.getTotalByRange.useQuery(
    {
      from: form.getValues("dateRange.from")!,
      to: form.getValues("dateRange.to")!,
    },
    {
      enabled: isDateRangeValid(),
    },
  );

  // Get MONTH - MONTH YEAR
  const getDisplay = () => {
    const from = form.getValues("dateRange.from");
    const to = form.getValues("dateRange.to");

    // verify if is not valid date
    if (!isDateRangeValid()) {
      return "";
    }

    return `${format(from!, "MMM")} - ${format(to!, "MMM")} ${format(from!, "yyyy")}`;
  };

  return (
    <>
      <div className=" flex flex-col  gap-2 px-4 py-1 md:gap-4 ">
        <div className="flex items-end  justify-end">
          <DatePicker
            calendar={{
              mode: "range",
              initialFocus: true,
              defaultMonth: form.getValues("dateRange.to"),
              selected: {
                from: form.watch("dateRange.from"),
                to: form.watch("dateRange.to"),
              },
              display: getDisplay(),
              onSelect: (range) => {
                if (!range) {
                  return;
                }

                console.log(
                  "Range from" + range.from + isValid(range.from) + "\n",
                  "Range to" + range.to + isValid(range.to),
                );

                form.setValue(
                  "dateRange.to",
                  range.to ? endOfDay(range.to) : undefined,
                );
                form.setValue(
                  "dateRange.from",
                  range.from ? startOfDay(range.from) : undefined,
                );
              },
            }}
            className="w-40"
          />
        </div>
        <div className="flex w-full justify-between gap-4 rounded bg-slate-900 p-2 text-white">
          <h2 className="text-2xl font-semibold">Total this month</h2>
          <p className="text-2xl font-semibold">{totalMonth} </p>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="hidden md:table-cell">
                Total Sales
              </TableHead>
              <TableHead className="hidden md:table-cell">Created at</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {spends?.map((spend, i) => (
              <TableRow key={spend.id}>
                <TableCell className="font-medium">{spend.name}</TableCell>
                <TableCell>
                  <Badge variant="outline">spend</Badge>
                </TableCell>
                <TableCell>{spend.amount}</TableCell>
                <TableCell className="hidden md:table-cell">
                  {spend.description}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {new Date(spend.createdAt).toLocaleString()}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
