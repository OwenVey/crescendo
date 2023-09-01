'use client';

import { ActivityIcon, Check, ChevronsUpDown, X } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { GENRES } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { Badge } from './ui';

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
          {genres.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {genres.map((genre) => (
                <Badge key={genre} className="whitespace-nowrap">
                  {GENRES.find((g) => g.value === genre)?.label}
                  <div
                    className="-mr-1.5 ml-0.5 rounded-full p-[2px] hover:bg-gray-700 dark:hover:bg-gray-300"
                    onClick={(e) => {
                      e.preventDefault();
                      remove(genre);
                    }}
                  >
                    <X className="h-3 w-3" />
                    <span className="sr-only">Remove</span>
                  </div>
                </Badge>
              ))}
            </div>
          ) : (
            <div className="flex items-center py-px font-normal text-gray-500 dark:text-gray-400">
              <ActivityIcon className="mr-2 h-4 w-4" />
              Search genres...
            </div>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
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
                <Check
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
