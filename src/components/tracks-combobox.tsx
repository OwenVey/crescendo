'use client';

import { CheckIcon, ChevronsUpDownIcon, MusicIcon } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import type { Track } from '@spotify/web-api-ts-sdk';
import Image from 'next/image';
import useSWRImmutable from 'swr/immutable';
import { useDebounce } from 'usehooks-ts';

type TracksComboboxProps = {
  tracks: Array<Track>;
  add: (track: Track) => void;
  remove: (track: Track) => void;
};

export function TracksCombobox({ tracks, add, remove }: TracksComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [searchText, setSearchText] = React.useState('');
  const debouncedSearchText = useDebounce(searchText, 500);

  const { data: searchResults = [], isLoading } = useSWRImmutable<Array<Track>>(
    debouncedSearchText && `/api/search-track?q=${debouncedSearchText}`,
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="h-auto justify-between">
          <div className="flex items-center py-px font-normal text-gray-500 dark:text-gray-400">
            <MusicIcon className="mr-2 h-4 w-4" />
            Search tracks...
          </div>
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" align="start">
        <Command>
          <CommandInput
            value={searchText}
            onValueChange={setSearchText}
            placeholder="Search tracks..."
            loading={isLoading}
          />
          <CommandList>
            <CommandEmpty>No tracks found</CommandEmpty>
            {searchResults.map((track) => (
              <CommandItem
                key={track.id}
                value={`${track.name}-${track.id}`}
                onSelect={() => {
                  if (tracks.some(({ id }) => id === track.id)) {
                    remove(track);
                  } else if (tracks.length < 5) {
                    add(track);
                  }
                }}
              >
                <div className="flex items-center gap-x-2">
                  <CheckIcon
                    className={cn(
                      'h-4 w-4 shrink-0',
                      tracks.some(({ id }) => id === track.id) ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                  <Image
                    className="h-8 w-8 rounded"
                    width={32}
                    height={32}
                    src={track.album.images[2]?.url ?? ''}
                    alt={`Picture of the album "${track.album.name}"`}
                    unoptimized
                  />

                  <div>
                    <div className="line-clamp-1">{track.name}</div>
                    <div className="line-clamp-1 text-gray-500 dark:text-gray-400">{track.artists[0]?.name}</div>
                  </div>
                </div>
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
