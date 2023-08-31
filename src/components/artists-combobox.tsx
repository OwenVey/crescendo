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
import type { Artist } from '@spotify/web-api-ts-sdk';
import Image from 'next/image';
import { useDebounce } from 'usehooks-ts';

type ArtistsComboboxProps = {
  selectedArtists: Array<Artist>;
  updateSelectedArtists: (artists: Array<Artist>) => void;
  loading?: boolean;
};

export function ArtistsCombobox({ selectedArtists, updateSelectedArtists, loading = false }: ArtistsComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [searchText, setSearchText] = React.useState('');
  const debouncedSearchText = useDebounce(searchText, 500);
  const [searchResults, setSearchResults] = React.useState<Array<Artist>>([]);
  const [_loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const results: Array<Artist> = await (await fetch(`/api/search-artist?q=${debouncedSearchText}`)).json();
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

  function removeSelectedArtist(artist: Artist) {
    updateSelectedArtists(selectedArtists.filter(({ id }) => id !== artist.id));
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
          {selectedArtists.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {selectedArtists.map((artist) => (
                <Badge key={artist.id} className="whitespace-nowrap">
                  {artist.name}
                  <div
                    className="-mr-1.5 ml-0.5 p-[2px] rounded-full hover:bg-gray-700 dark:hover:bg-gray-400"
                    onClick={(e) => {
                      e.preventDefault();
                      removeSelectedArtist(artist);
                    }}
                  >
                    <X className="h-3 w-3" />
                    <span className="sr-only">Remove</span>
                  </div>
                </Badge>
              ))}
            </div>
          ) : (
            <span className="font-normal py-px text-gray-500 dark:text-gray-400">Search artists...</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" align="start">
        <Command>
          <CommandInput
            value={searchText}
            onValueChange={setSearchText}
            placeholder="Search artists..."
            loading={_loading}
          />
          <CommandList>
            <CommandEmpty>No artists found</CommandEmpty>
            {searchResults.map((artist) => (
              <CommandItem
                key={artist.id}
                value={`${artist.name}-${artist.id}`}
                onSelect={() => {
                  if (selectedArtists.some(({ id }) => id === artist.id)) {
                    removeSelectedArtist(artist);
                  } else if (selectedArtists.length < 5) {
                    updateSelectedArtists([...selectedArtists, artist]);
                  }
                }}
              >
                <div className="flex items-center gap-x-2">
                  <Check
                    className={cn(
                      'h-4 w-4 shrink-0',
                      selectedArtists.some(({ id }) => id === artist.id) ? 'opacity-100' : 'opacity-0',
                    )}
                  />

                  {artist.images[0] ? (
                    <Image
                      className="h-8 w-8 rounded-full"
                      width={32}
                      height={32}
                      src={artist.images[0].url}
                      alt={`Picture of ${artist.name}`}
                    />
                  ) : (
                    <span className="inline-block h-8 w-8 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-600">
                      <svg
                        className="h-full w-full text-gray-300 dark:text-gray-800"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </span>
                  )}

                  <span className="truncate w-48">{artist.name}</span>
                </div>
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
