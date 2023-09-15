'use client';

import { CheckIcon, ChevronsUpDownIcon, MusicIcon, XIcon } from 'lucide-react';
import * as React from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import type { Track } from '@spotify/web-api-ts-sdk';
import Image from 'next/image';
import useSWR from 'swr';
import { useDebounce } from 'usehooks-ts';

type TracksComboboxProps = {
  tracks: Array<Track>;
  add: (track: Track) => void;
  remove: (track: Track) => void;
  loading?: boolean;
};

export function TracksCombobox({ tracks, add, remove, loading = false }: TracksComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [searchText, setSearchText] = React.useState('');
  const debouncedSearchText = useDebounce(searchText, 500);

  const { data: searchResults = [], isLoading } = useSWR<Array<Track>>(
    debouncedSearchText && `/api/search-track?q=${debouncedSearchText}`,
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          loading={loading}
          className={cn(loading ? '' : 'h-auto justify-between')}
        >
          {tracks.length > 0 ? (
            <div className="flex flex-wrap gap-1 overflow-hidden">
              {tracks.map((track) => (
                <Badge key={track.id} className="overflow-hidden">
                  <span className="truncate">{track.name}</span>
                  <div
                    className="-mr-1.5 ml-0.5 rounded-full p-[2px] hover:bg-gray-700 dark:hover:bg-gray-300"
                    onClick={(e) => {
                      e.preventDefault();
                      remove(track);
                    }}
                  >
                    <XIcon className="h-3 w-3" />
                    <span className="sr-only">Remove</span>
                  </div>
                </Badge>
              ))}
            </div>
          ) : (
            <div className="flex items-center py-px font-normal text-gray-500 dark:text-gray-400">
              <MusicIcon className="mr-2 h-4 w-4" />
              Search tracks...
            </div>
          )}
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
                    src={track.album.images[0].url}
                    alt={`Picture of the album "${track.album.name}"`}
                  />

                  <div>
                    <div className="w-48 truncate">{track.name}</div>
                    <div className="w-48 truncate text-gray-500 dark:text-gray-400">{track.artists[0].name}</div>
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
