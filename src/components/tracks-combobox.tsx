'use client';

import { Check, ChevronsUpDown, X } from 'lucide-react';
import * as React from 'react';

import {
  Badge,
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Track } from '@spotify/web-api-ts-sdk';
import Image from 'next/image';
import { useDebounce } from 'usehooks-ts';

type TracksComboboxProps = {
  selectedTracks: Array<Track>;
  updateSelectedTracks: (tracks: Array<Track>) => void;
  loading?: boolean;
};

export function TracksCombobox({ selectedTracks, updateSelectedTracks, loading = false }: TracksComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [searchText, setSearchText] = React.useState('');
  const debouncedSearchText = useDebounce(searchText, 500);
  const [searchResults, setSearchResults] = React.useState<Array<Track>>([]);
  const [_loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const results: Array<Track> = await (await fetch(`/api/search-track?q=${debouncedSearchText}`)).json();
      setSearchResults((prevResults) => {
        const mergedResults = prevResults.concat(results);
        const uniqueResults = mergedResults.filter(
          (value, index, self) => self.findIndex(({ id }) => id === value.id) === index,
        );
        return uniqueResults;
      });
      setLoading(false);
    }
    if (debouncedSearchText) fetchData();
  }, [debouncedSearchText]);

  function removeSelectedTrack(track: Track) {
    updateSelectedTracks(selectedTracks.filter(({ id }) => id !== track.id));
  }

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
          {selectedTracks.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {selectedTracks.map((track) => (
                <Badge key={track.id} className="whitespace-nowrap">
                  {track.name}
                  <div
                    className="-mr-1.5 ml-0.5 p-[2px] rounded-full hover:bg-gray-700 dark:hover:bg-gray-400"
                    onClick={(e) => {
                      e.preventDefault();
                      removeSelectedTrack(track);
                    }}
                  >
                    <X className="h-3 w-3" />
                    <span className="sr-only">Remove</span>
                  </div>
                </Badge>
              ))}
            </div>
          ) : (
            <span className="font-normal py-px text-gray-500 dark:text-gray-400">Search tracks...</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" align="start">
        <Command>
          <CommandInput
            value={searchText}
            onValueChange={setSearchText}
            placeholder="Search tracks..."
            loading={_loading}
          />
          <CommandList>
            <CommandEmpty>No tracks found</CommandEmpty>
            {searchResults.map((track) => (
              <CommandItem
                key={track.id}
                value={`${track.name}-${track.id}`}
                onSelect={() => {
                  if (selectedTracks.some(({ id }) => id === track.id)) {
                    removeSelectedTrack(track);
                  } else if (selectedTracks.length < 5) {
                    updateSelectedTracks([...selectedTracks, track]);
                  }
                }}
              >
                <div className="flex items-center gap-x-2">
                  <Check
                    className={cn(
                      'h-4 w-4 shrink-0',
                      selectedTracks.some(({ id }) => id === track.id) ? 'opacity-100' : 'opacity-0',
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
                    {track.name} <span className="text-gray-500 dark:text-gray-400">by {track.artists[0].name}</span>
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
