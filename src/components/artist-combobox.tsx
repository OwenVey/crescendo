'use client';

import { Check, ChevronsUpDown } from 'lucide-react';
import * as React from 'react';

import {
  Badge,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  Popover,
  PopoverContent,
  PopoverTrigger,
  ScrollArea,
} from '@/components/ui';
import { Button } from '@/components/ui/button';

import { cn } from '@/lib/utils';

const GENRES = [
  { value: 'acoustic', label: 'Acoustic' },
  { value: 'afrobeat', label: 'Afrobeat' },
  { value: 'alt-rock', label: 'Alt Rock' },
  { value: 'alternative', label: 'Alternative' },
  { value: 'ambient', label: 'Ambient' },
  { value: 'anime', label: 'Anime' },
  { value: 'black-metal', label: 'Black Metal' },
  { value: 'bluegrass', label: 'Bluegrass' },
  { value: 'blues', label: 'Blues' },
  { value: 'bossanova', label: 'Bossanova' },
  { value: 'brazil', label: 'Brazil' },
  { value: 'breakbeat', label: 'Breakbeat' },
  { value: 'british', label: 'British' },
  { value: 'cantopop', label: 'Cantopop' },
  { value: 'chicago-house', label: 'Chicago House' },
  { value: 'children', label: 'Children' },
  { value: 'chill', label: 'Chill' },
  { value: 'classical', label: 'Classical' },
  { value: 'club', label: 'Club' },
  { value: 'comedy', label: 'Comedy' },
  { value: 'country', label: 'Country' },
  { value: 'dance', label: 'Dance' },
  { value: 'dancehall', label: 'Dancehall' },
  { value: 'death-metal', label: 'Death Metal' },
  { value: 'deep-house', label: 'Deep House' },
  { value: 'detroit-techno', label: 'Detroit Techno' },
  { value: 'disco', label: 'Disco' },
  { value: 'disney', label: 'Disney' },
  { value: 'drum-and-bass', label: 'Drum and Bass' },
  { value: 'dub', label: 'Dub' },
  { value: 'dubstep', label: 'Dubstep' },
  { value: 'edm', label: 'Edm' },
  { value: 'electro', label: 'Electro' },
  { value: 'electronic', label: 'Electronic' },
  { value: 'emo', label: 'Emo' },
  { value: 'folk', label: 'Folk' },
  { value: 'forro', label: 'Forro' },
  { value: 'french', label: 'French' },
  { value: 'funk', label: 'Funk' },
  { value: 'garage', label: 'Garage' },
  { value: 'german', label: 'German' },
  { value: 'gospel', label: 'Gospel' },
  { value: 'goth', label: 'Goth' },
  { value: 'grindcore', label: 'Grindcore' },
  { value: 'groove', label: 'Groove' },
  { value: 'grunge', label: 'Grunge' },
  { value: 'guitar', label: 'Guitar' },
  { value: 'happy', label: 'Happy' },
  { value: 'hard-rock', label: 'Hard Rock' },
  { value: 'hardcore', label: 'Hardcore' },
  { value: 'hardstyle', label: 'Hardstyle' },
  { value: 'heavy-metal', label: 'Heavy Metal' },
  { value: 'hip-hop', label: 'Hip-Hop' },
  { value: 'holidays', label: 'Holidays' },
  { value: 'honky-tonk', label: 'Honky Tonk' },
  { value: 'house', label: 'House' },
  { value: 'idm', label: 'Idm' },
  { value: 'indian', label: 'Indian' },
  { value: 'indie', label: 'Indie' },
  { value: 'indie-pop', label: 'Indie Pop' },
  { value: 'industrial', label: 'Industrial' },
  { value: 'iranian', label: 'Iranian' },
  { value: 'j-dance', label: 'J Dance' },
  { value: 'j-idol', label: 'J Idol' },
  { value: 'j-pop', label: 'J Pop' },
  { value: 'j-rock', label: 'J Rock' },
  { value: 'jazz', label: 'Jazz' },
  { value: 'k-pop', label: 'K-pop' },
  { value: 'kids', label: 'Kids' },
  { value: 'latin', label: 'Latin' },
  { value: 'latino', label: 'Latino' },
  { value: 'malay', label: 'Malay' },
  { value: 'mandopop', label: 'Mandopop' },
  { value: 'metal', label: 'Metal' },
  { value: 'metal-misc', label: 'Metal Misc' },
  { value: 'metalcore', label: 'Metalcore' },
  { value: 'minimal-techno', label: 'Minimal Techno' },
  { value: 'movies', label: 'Movies' },
  { value: 'mpb', label: 'Mpb' },
  { value: 'new-age', label: 'New Age' },
  { value: 'new-release', label: 'New Release' },
  { value: 'opera', label: 'Opera' },
  { value: 'pagode', label: 'Pagode' },
  { value: 'party', label: 'Party' },
  { value: 'philippines-opm', label: 'Philippines OPM' },
  { value: 'piano', label: 'Piano' },
  { value: 'pop', label: 'Pop' },
  { value: 'pop-film', label: 'Pop Film' },
  { value: 'post-dubstep', label: 'Post Dubstep' },
  { value: 'power-pop', label: 'Power Pop' },
  { value: 'progressive-house', label: 'Progressive House' },
  { value: 'psych-rock', label: 'Psych Rock' },
  { value: 'punk', label: 'Punk' },
  { value: 'punk-rock', label: 'Punk Rock' },
  { value: 'r-n-b', label: 'RnB' },
  { value: 'rainy-day', label: 'Rainy Fay' },
  { value: 'reggae', label: 'Reggae' },
  { value: 'reggaeton', label: 'Reggaeton' },
  { value: 'road-trip', label: 'Road Trip' },
  { value: 'rock', label: 'Rock' },
  { value: 'rock-n-roll', label: 'Rock n Roll' },
  { value: 'rockabilly', label: 'Rockabilly' },
  { value: 'romance', label: 'Romance' },
  { value: 'sad', label: 'Sad' },
  { value: 'salsa', label: 'Salsa' },
  { value: 'samba', label: 'Samba' },
  { value: 'sertanejo', label: 'Sertanejo' },
  { value: 'show-tunes', label: 'Show Tunes' },
  { value: 'singer-songwriter', label: 'Singer Songwriter' },
  { value: 'ska', label: 'Ska' },
  { value: 'sleep', label: 'Sleep' },
  { value: 'songwriter', label: 'Songwriter' },
  { value: 'soul', label: 'Soul' },
  { value: 'soundtracks', label: 'Soundtracks' },
  { value: 'spanish', label: 'Spanish' },
  { value: 'study', label: 'Study' },
  { value: 'summer', label: 'Summer' },
  { value: 'swedish', label: 'Swedish' },
  { value: 'synth-pop', label: 'Synth Pop' },
  { value: 'tango', label: 'Tango' },
  { value: 'techno', label: 'Techno' },
  { value: 'trance', label: 'Trance' },
  { value: 'trip-hop', label: 'Trip Hop' },
  { value: 'turkish', label: 'Turkish' },
  { value: 'work-out', label: 'Work Out' },
  { value: 'world-music', label: 'World Music' },
];

type ArtistComboboxProps = {
  selectedArtists: Array<string>;
  updateArtists: (artists: Array<string>) => void;
};

export function ArtistCombobox({ selectedArtists, updateArtists }: ArtistComboboxProps) {
  const [open, setOpen] = React.useState(false);

  // const [values, setValues] = React.useState<Array<string>>([]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="h-auto justify-between">
          {selectedArtists.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {selectedArtists.map((artist) => (
                <Badge key={artist} className="whitespace-nowrap">
                  {GENRES.find((g) => g.value === artist)?.label}
                </Badge>
              ))}
            </div>
          ) : (
            <span className="font-normal text-gray-500 dark:text-gray-400">Select artists...</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" align="start">
        <Command>
          <CommandInput placeholder="Search artists..." />
          <CommandEmpty>No artist found.</CommandEmpty>
          <CommandGroup>
            <ScrollArea className="h-72">
              {GENRES.map((artist) => (
                <CommandItem
                  key={artist.value}
                  onSelect={() => {
                    if (selectedArtists.some((g) => g === artist.value)) {
                      updateArtists(selectedArtists.filter((g) => g !== artist.value));
                    } else if (selectedArtists.length < 5) {
                      updateArtists([...selectedArtists, artist.value]);
                    }
                    // setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      selectedArtists.some((g) => g === artist.value) ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                  {artist.label}
                </CommandItem>
              ))}
            </ScrollArea>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
