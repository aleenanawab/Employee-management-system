"use client";

import { useState } from "react";
import {
  flexRender, getCoreRowModel, getPaginationRowModel,
  getSortedRowModel, useReactTable,
  type ColumnDef, type SortingState,
} from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, ChevronLeft, ChevronRight, ArrowUpDown } from "lucide-react";
import { formatCurrency, formatDate, getInitials } from "@/lib/utils";
import type { Employee } from "@/types";

interface Props {
  data: Employee[];
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
}

export function EmployeeTable({ data, onEdit, onDelete }: Props) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns: ColumnDef<Employee>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <button className="flex items-center gap-1 hover:opacity-70 transition-opacity"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Name <ArrowUpDown size={13} />
        </button>
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarFallback className="text-xs font-bold text-white"
              style={{ background: "linear-gradient(135deg, #6d28d9, #059669)" }}>
              {getInitials(row.original.name)}
            </AvatarFallback>
          </Avatar>
          <span className="font-medium" style={{ color: "var(--fg)" }}>{row.original.name}</span>
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => <span style={{ color: "var(--fg-muted)" }}>{row.original.email}</span>,
    },
    {
      accessorKey: "position",
      header: "Position",
      cell: ({ row }) => <span style={{ color: "var(--fg)" }}>{row.original.position}</span>,
    },
    {
      accessorKey: "department",
      header: "Department",
      cell: ({ row }) => {
        const dept = row.original.department;
        const name = typeof dept === "object" ? dept.name : "N/A";
        return <span style={{ color: "var(--fg-muted)" }}>{name}</span>;
      },
    },
    {
      accessorKey: "salary",
      header: ({ column }) => (
        <button className="flex items-center gap-1 hover:opacity-70 transition-opacity"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Salary <ArrowUpDown size={13} />
        </button>
      ),
      cell: ({ row }) => <span className="font-medium" style={{ color: "var(--fg)" }}>{formatCurrency(row.original.salary)}</span>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const active = row.original.status === "active";
        return (
          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
            style={{
              background: active ? "rgba(5,150,105,0.12)" : "rgba(100,116,139,0.12)",
              color: active ? "#059669" : "var(--fg-muted)",
            }}>
            {row.original.status}
          </span>
        );
      },
    },
    {
      accessorKey: "joiningDate",
      header: "Joining Date",
      cell: ({ row }) => <span style={{ color: "var(--fg-muted)" }}>{formatDate(row.original.joiningDate)}</span>,
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon"><MoreHorizontal size={16} /></Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
            <DropdownMenuLabel style={{ color: "var(--fg-muted)" }}>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onEdit(row.original)} style={{ color: "var(--fg)" }}>Edit</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(row.original)} style={{ color: "#ef4444" }}>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data, columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: { sorting },
    initialState: { pagination: { pageSize: 10 } },
  });

  return (
    <div className="space-y-4">
      <div className="rounded-xl overflow-hidden"
        style={{ background: "var(--bg-card)", border: "1px solid var(--border)", boxShadow: "var(--shadow-card)" }}>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((h) => (
                  <TableHead key={h.id}>
                    {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No employees found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm" style={{ color: "var(--fg-muted)" }}>
          {data.length} result{data.length !== 1 ? "s" : ""} &mdash; Page {table.getState().pagination.pageIndex + 1} of {Math.max(table.getPageCount(), 1)}
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            <ChevronLeft size={16} />
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}
