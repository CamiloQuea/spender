'use client'
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableFooter, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { Transaction } from '@/server/db/schema';
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import React from 'react'

const columnHelper = createColumnHelper<Transaction>();

const columns = [
    columnHelper.accessor("name", {
        header: () => "Name",
        cell: (info) => info.getValue(),
    }),
    columnHelper.accessor((row) => ["spend", "spend"], {
        id: "status",
        header: () => <span>Status</span>,
        cell: (info) => (
        <ul className="flex gap-1">
            {info.getValue().map((status) => (
            <li>
                <Badge className="rounded-full">{status}</Badge>
            </li>
            ))}
        </ul>
        ),
    }),
    columnHelper.accessor("description", {
        header: () => "Description",
        cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("amount", {
        header: () => <span>Amount</span>,
        //paint green if positive and red if negative
        cell: (info) => (
        <span
            className={cn("font-medium",info.getValue() > 0 ? "text-green-600" : "text-red-500")}
        >
            {info.getValue()}
        </span>
        ),
    }),

    columnHelper.display({
        id: "actions",
        header: () => "Actions",
        cell: (info) => (
        <DropdownMenu>
            <DropdownMenuTrigger>
            <Button>
                <MoreHorizontal />
            </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>Delete</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
        ),
    }),
    ];

const LoansTable = ({loans}:{loans:Transaction[]}) => {
    const table = useReactTable({
        data: loans,
        columns,
        getCoreRowModel: getCoreRowModel(),
      });
    
      return (
        <div className="overflow-clip rounded border bg-white">
          <Table>
            <TableHeader className="bg-foreground text-white ">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow className="font-medium hover:bg-foreground">
                  {headerGroup.headers.map((header) => (
                    <TableCell key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              {table.getFooterGroups().map((footerGroup) => (
                <TableRow className="">
                  {footerGroup.headers.map((footer) => (
                    <TableCell key={footer.id}>
                      {footer.isPlaceholder
                        ? null
                        : flexRender(
                            footer.column.columnDef.footer,
                            footer.getContext(),
                          )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableFooter>
          </Table>
        </div>
      );
}

export default LoansTable