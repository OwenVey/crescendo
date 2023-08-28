'use client';

import { Check, ChevronsUpDown } from 'lucide-react';
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
import { CommandLoading } from 'cmdk';
import { useDebounce } from 'usehooks-ts';

type ArtistComboboxProps = {
  selectedArtists: Array<Artist>;
  updateArtists: (artists: Array<Artist>) => void;
};

export function ArtistCombobox({ selectedArtists, updateArtists }: ArtistComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [searchText, setSearchText] = React.useState('');
  const debouncedSearchText = useDebounce(searchText, 500);
  const [searchResults, setSearchResults] = React.useState<Array<Artist>>([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const results: Array<Artist> = await (await fetch(`/api/artist?q=${debouncedSearchText}`)).json();
      const mergedResults = searchResults.concat(results);
      const uniqueResults = mergedResults.filter(
        (value, index, self) => self.findIndex((m) => m.id === value.id) === index,
      );
      setSearchResults(uniqueResults);
      setLoading(false);
    }
    if (debouncedSearchText) fetchData();
  }, [debouncedSearchText]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="h-auto justify-between">
          {selectedArtists.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {selectedArtists.map((artist) => (
                <Badge key={artist.id} className="whitespace-nowrap">
                  {searchResults.find((a) => a.id === artist.id)?.name}
                </Badge>
              ))}
            </div>
          ) : (
            <span className="font-normal text-gray-500 dark:text-gray-400">Search artists...</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" align="start">
        <Command>
          <CommandInput value={searchText} onValueChange={setSearchText} placeholder="Search artists..." />
          <CommandEmpty>No artist found.</CommandEmpty>
          <CommandList>
            {loading && <CommandLoading>Loading...…</CommandLoading>}
            {searchResults.map((artist) => (
              <CommandItem
                key={artist.id}
                value={artist.name}
                onSelect={() => {
                  if (selectedArtists.some((a) => a.id === artist.id)) {
                    updateArtists(selectedArtists.filter((a) => a.id !== artist.id));
                  } else if (selectedArtists.length < 5) {
                    updateArtists([...selectedArtists, artist]);
                  }
                }}
              >
                <Check
                  className={cn(
                    'mr-2 h-4 w-4',
                    selectedArtists.some((a) => a.id === artist.id) ? 'opacity-100' : 'opacity-0',
                  )}
                />
                {artist.name}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
