'use client';

import { CheckIcon, LoaderIcon, UserIcon } from 'lucide-react';
import * as React from 'react';

import {
  Command,
  CommandEmpty,
  CommandItem,
  CommandList,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui';
import { cn } from '@/lib/utils';
import type { Artist } from '@spotify/web-api-ts-sdk';
import Image from 'next/image';
import { useDebounce } from 'usehooks-ts';

type ArtistsSearchProps = {
  artists: Array<Artist>;
  add: (artist: Artist) => void;
  remove: (artist: Artist) => void;
  loading?: boolean;
};

export function ArtistsSearch({ artists, add, remove, loading = false }: ArtistsSearchProps) {
  const [open, setOpen] = React.useState(false);
  const [searchText, setSearchText] = React.useState('');
  const debouncedSearchText = useDebounce(searchText, 500);
  const [searchResults, setSearchResults] = React.useState<Array<Artist>>([]);
  const [_loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    async function fetchData() {
      setSearchResults([]);

      try {
        setLoading(true);
        const results: Array<Artist> = await (await fetch(`/api/search-artist?q=${debouncedSearchText}`)).json();
        setSearchResults(results);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    if (debouncedSearchText) fetchData();
  }, [debouncedSearchText]);

  return (
    <Popover
      open={searchText !== '' || open}
      onOpenChange={(open) => {
        console.log({ open });

        setOpen(open);
        setSearchText('');
        setSearchResults([]);
      }}
    >
      <PopoverTrigger tabIndex={-1} onKeyUp={(e) => e.code === 'Space' && e.preventDefault()}>
        <Input
          value={searchText}
          placeholder="Search artists..."
          icon={
            _loading || loading ? <LoaderIcon className="h-4 w-4 animate-spin" /> : <UserIcon className="h-4 w-4" />
          }
          onChange={(e) => {
            setSearchText(e.target.value);
            e.preventDefault();
          }}
        />
      </PopoverTrigger>
      {/* {searchResults.length > 0 && ( */}
      <PopoverContent
        className="p-0"
        align="start"
        onOpenAutoFocus={(e) => e.preventDefault()}
        onCloseAutoFocus={(e) => {
          e.preventDefault();
          //   setSearchText('');
        }}
      >
        <Command>
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
      {/* )} */}
    </Popover>
  );
}
