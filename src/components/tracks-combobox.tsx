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
  CommandLoading,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Track } from '@spotify/web-api-ts-sdk';
import { useDebounce } from 'usehooks-ts';

type TracksComboboxProps = {
  selectedTracks: Array<Track>;
  updateSelectedTracks: (tracks: Array<Track>) => void;
};

export function TracksCombobox({ selectedTracks, updateSelectedTracks }: TracksComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [searchText, setSearchText] = React.useState('');
  const debouncedSearchText = useDebounce(searchText, 500);
  const [searchResults, setSearchResults] = React.useState<Array<Track>>([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const results: Array<Track> = await (await fetch(`/api/track?q=${debouncedSearchText}`)).json();
      setSearchResults((prevResults) => {
        const mergedResults = prevResults.concat(results);
        const uniqueResults = mergedResults.filter(
          (value, index, self) => self.findIndex((m) => m.id === value.id) === index,
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
        <Button variant="outline" role="combobox" aria-expanded={open} className="h-auto justify-between">
          {selectedTracks.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {selectedTracks.map((track) => (
                <Badge key={track.id} className="whitespace-nowrap">
                  {searchResults.find((a) => a.id === track.id)?.name}
                </Badge>
              ))}
            </div>
          ) : (
            <span className="font-normal text-gray-500 dark:text-gray-400">Search tracks...</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" align="start">
        <Command>
          <CommandInput value={searchText} onValueChange={setSearchText} placeholder="Search tracks..." />
          <CommandList>
            <CommandEmpty style={{ display: loading ? 'none' : '' }}>No tracks found</CommandEmpty>
            {loading && <CommandLoading />}
            {!loading &&
              searchResults.map((track) => (
                <CommandItem
                  key={track.id}
                  value={track.name}
                  onSelect={() => {
                    if (selectedTracks.some((a) => a.id === track.id)) {
                      updateSelectedTracks(selectedTracks.filter((a) => a.id !== track.id));
                    } else if (selectedTracks.length < 5) {
                      updateSelectedTracks([...selectedTracks, track]);
                    }
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4 shrink-0',
                      selectedTracks.some((a) => a.id === track.id) ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                  <div>
                    {track.name} <span className="text-gray-500 dark:text-gray-400">by {track.artists[0].name}</span>
                  </div>
                </CommandItem>
              ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
