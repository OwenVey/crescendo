'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DataTableColumnHeader } from '@/components/ui/table-header';
import { millisecondsToMmSs } from '@/lib/utils';
import type { Artist, Track } from '@spotify/web-api-ts-sdk';
import type { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import Image from 'next/image';

export const columns: ColumnDef<Track>[] = [
  {
    id: 'image',
    cell: ({ row }) => (
      <Image
        className="h-12 w-12 rounded-lg"
        src={row.original.album.images[0].url}
        width={48}
        height={48}
        alt={`Album cover for ${row.original.name}`}
        unoptimized
      />
    ),
  },
  {
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
    cell: ({ row }) => <span className="max-w-xs text-gray-950 dark:text-white">{row.getValue('name')}</span>,
  },
  {
    accessorKey: 'artists',
    header: 'Artists',
    cell: ({ row }) =>
      row
        .getValue<Array<Artist>>('artists')
        .map(({ name }) => name)
        .join(', '),
  },
  {
    accessorKey: 'popularity',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Popularity" />,
  },
  {
    accessorKey: 'duration_ms',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Duration" />,
    cell: ({ row }) => <span className="tabular-nums">{millisecondsToMmSs(row.getValue('duration_ms'))}</span>,
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const track = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(track.id)}>Copy track ID</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>TODO</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
