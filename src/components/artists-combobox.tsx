'use client';

import { CheckIcon, ChevronsUpDownIcon, UserIcon, XIcon } from 'lucide-react';
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
  artists: Array<Artist>;
  add: (artist: Artist) => void;
  remove: (artist: Artist) => void;
  loading?: boolean;
};

export function ArtistsCombobox({ artists, add, remove, loading = false }: ArtistsComboboxProps) {
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
          {artists.length > 0 ? (
            <div className="flex flex-wrap gap-1 overflow-hidden">
              {artists.map((artist) => (
                <Badge key={artist.id} className="overflow-hidden">
                  <span className="truncate">{artist.name}</span>
                  <div
                    className="-mr-1.5 ml-0.5 rounded-full p-[2px] hover:bg-gray-700 dark:hover:bg-gray-300"
                    onClick={(e) => {
                      e.preventDefault();
                      remove(artist);
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
              <UserIcon className="mr-2 h-4 w-4" />
              Search artists...
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
                  if (artists.some(({ id }) => id === artist.id)) {
                    remove(artist);
                  } else if (artists.length < 5) {
                    add(artist);
                  }
                }}
              >
                <div className="flex items-center gap-x-2">
                  <CheckIcon
                    className={cn(
                      'h-4 w-4 shrink-0',
                      artists.some(({ id }) => id === artist.id) ? 'opacity-100' : 'opacity-0',
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

                  <span className="w-48 truncate">{artist.name}</span>
                </div>
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
