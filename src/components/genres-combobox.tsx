'use client';

import { ActivityIcon, CheckIcon, ChevronsUpDownIcon } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { GENRES } from '@/lib/constants';
import { cn } from '@/lib/utils';

type GenresComboboxProps = {
  genres: Array<string>;
  add: (genre: string) => void;
  remove: (genre: string) => void;
};

export function GenresCombobox({ genres, add, remove }: GenresComboboxProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="h-auto justify-between">
          <div className="flex items-center py-px font-normal text-gray-500 dark:text-gray-400">
            <ActivityIcon className="mr-2 h-4 w-4" />
            Search genres...
          </div>
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" align="start">
        <Command>
          <CommandInput placeholder="Search genre..." />
          <CommandList>
            <CommandEmpty>No genre found.</CommandEmpty>
            {GENRES.map((genre) => (
              <CommandItem
                key={genre.value}
                onSelect={() => {
                  if (genres.some((g) => g === genre.value)) {
                    remove(genre.value);
                  } else if (genres.length < 5) {
                    add(genre.value);
                  }
                }}
              >
                <CheckIcon
                  className={cn('mr-2 h-4 w-4', genres.some((g) => g === genre.value) ? 'opacity-100' : 'opacity-0')}
                />
                {genre.label}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
