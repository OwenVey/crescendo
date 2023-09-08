import type { Column } from '@tanstack/react-table';

import { cn } from '@/lib/utils';
import { ArrowDownIcon, ArrowUpIcon, ChevronsUpDownIcon } from 'lucide-react';
import { Button } from './button';

interface DataTableColumnHeaderProps<TData, TValue> extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>;
  }

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <Button
        onClick={() => column.toggleSorting()}
        variant="ghost"
        size="sm"
        className="-ml-3 h-8 text-gray-500 hover:bg-white dark:text-gray-400"
      >
        <span>{title}</span>
        {column.getIsSorted() === 'desc' ? (
          <ArrowDownIcon className="ml-2 h-4 w-4" />
        ) : column.getIsSorted() === 'asc' ? (
          <ArrowUpIcon className="ml-2 h-4 w-4" />
        ) : (
          <ChevronsUpDownIcon className="ml-2 h-4 w-4" />
        )}
      </Button>
    </div>
  );
}
