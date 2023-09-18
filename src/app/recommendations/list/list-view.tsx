'use client';

import type { ColumnFiltersState, SortingState } from '@tanstack/react-table';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import * as React from 'react';

import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Track } from '@spotify/web-api-ts-sdk';
import { columns } from './columns';

type ListViewProps = {
  tracks: Array<Track>;
};

export function ListView({ tracks }: ListViewProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data: tracks,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <div className="overflow-y-auto p-8">
      <Input
        placeholder="Filter songs..."
        value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
        onChange={(event) => table.getColumn('name')?.setFilterValue(event.target.value)}
        className="mb-4 max-w-sm"
      />

      <Table className="border-separate border-spacing-y-2">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="hover:bg-inherit dark:hover:bg-inherit">
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id} className="px-2">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
                className="bg-white dark:bg-gray-950"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="p-2 first:rounded-l-xl last:rounded-r-xl dark:text-gray-400">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
