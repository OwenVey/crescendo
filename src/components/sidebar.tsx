'use client';
import logo from '@/app/logo.png';
import { ArtistsCombobox } from '@/components/artists-combobox';
import { GenresCombobox } from '@/components/genres-combobox';
import { SignInButton } from '@/components/sign-in-button';
import { ThemeToggle } from '@/components/theme-toggle';
import { TracksCombobox } from '@/components/tracks-combobox';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Label,
  Slider,
  Toggle,
  useToast,
} from '@/components/ui';
import { arrayToURLSearchParams, objectToURLSearchParams } from '@/lib/utils';
import type { Artist, Track } from '@spotify/web-api-ts-sdk';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export function Sidebar() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [loadingArtists, setLoadingArtists] = useState(false);
  const [loadingTracks, setLoadingTracks] = useState(false);

  const [seedArtists, setSeedArtists] = useState<Array<Artist>>([]);
  const [seedTracks, setSeedTracks] = useState<Array<Track>>([]);
  const [seedGenres, setSeedGenres] = useState<Array<string>>([]);
  const [acousticness, setAcousticness] = useState([0, 0.5, 1]);
  const [urlParams, setUrlParams] = useState('');

  const TRACK_ATTRIBUTES = [
    { value: 'acousticness', label: 'Acousticness' },
    { value: 'danceability', label: 'Danceability' },
    { value: 'duration_ms', label: 'Duration' },
    { value: 'energy', label: 'Energy' },
    { value: 'instrumentalness', label: 'Instrumentalness' },
    { value: 'key', label: 'Key' },
    { value: 'liveness', label: 'Liveness' },
    { value: 'loudness', label: 'Loudness' },
    { value: 'mode', label: 'Mode' },
    { value: 'popularity', label: 'Popularity' },
    { value: 'speechiness', label: 'Speechiness' },
    { value: 'tempo', label: 'Tempo' },
    { value: 'time_signature', label: 'Time Signature' },
    { value: 'valence', label: 'Valence' },
  ];

  useEffect(() => {
    const params = objectToURLSearchParams({
      seed_artists: seedArtists.map(({ id }) => id),
      seed_tracks: seedTracks.map(({ id }) => id),
      seed_genres: seedGenres,
      min_acousticness: acousticness[0],
      target_acousticness: acousticness[1],
      max_acousticness: acousticness[2],
    });

    setUrlParams(params.toString());
  }, [seedArtists, seedTracks, seedGenres, acousticness]);

  useEffect(() => {
    console.log('Syncing searchParams with state...');

    const artistIds = searchParams.getAll('seed_artists');
    getArtists(artistIds);

    const trackIds = searchParams.getAll('seed_tracks');
    getTracks(trackIds);

    const genresParam = searchParams.getAll('seed_genres');
    setSeedGenres(genresParam);
  }, [searchParams]);

  async function getArtists(ids: Array<string>) {
    if (ids.length === 0) {
      setSeedArtists([]);
      return;
    }
    setLoadingArtists(true);
    const idsParams = arrayToURLSearchParams('ids', ids).toString();
    try {
      const artists: Array<Artist> = await (await fetch(`/api/artists?${idsParams}`)).json();
      setSeedArtists(artists);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingArtists(false);
    }
  }

  async function getTracks(ids: Array<string>) {
    if (ids.length === 0) {
      setSeedTracks([]);
      return;
    }
    setLoadingTracks(true);
    const idsParams = arrayToURLSearchParams('ids', ids).toString();
    try {
      const tracks: Array<Track> = await (await fetch(`/api/tracks?${idsParams}`)).json();
      setSeedTracks(tracks);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingTracks(false);
    }
  }

  function validateParams(event: React.MouseEvent<HTMLAnchorElement>) {
    const totalSeeds = seedArtists.length + seedTracks.length + seedGenres.length;
    if (totalSeeds < 1) {
      event.preventDefault();
      toast({
        variant: 'destructive',
        title: 'Error! Not enough seeds!',
        description: 'Must have at least 1 seed between Seed Artists, Seed Tracks, and Seed Genres',
      });
      return;
    }

    if (totalSeeds > 5) {
      event.preventDefault();
      toast({
        variant: 'destructive',
        title: 'Error! Too many seeds!',
        description: 'Max of 5 seed may be provided in any combination of Seed Artists, Seed Tracks, and Seed Genres',
      });
      return;
    }
  }

  return (
    <aside className="fixed inset-y-0 z-50 flex w-80 flex-col border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
      {/* Header */}
      <header className="flex items-center px-6 py-3">
        <Link href="/" className="flex items-center">
          <Image src={logo} alt="Logo" className="h-10 w-10" />
          <h1 className="ml-2 text-xl font-bold">Crescendo</h1>
        </Link>
      </header>

      {/* Scrollable Content */}
      <div className="flex-grow overflow-auto px-6 py-3">
        <div className="flex flex-col gap-y-6">
          <div className="flex flex-col">
            <Label className="mb-2">Seed Artists</Label>
            <ArtistsCombobox
              selectedArtists={seedArtists}
              updateSelectedArtists={setSeedArtists}
              loading={loadingArtists}
            />
          </div>

          <div className="flex flex-col">
            <Label className="mb-2">Seed Tracks</Label>
            <TracksCombobox selectedTracks={seedTracks} updateSelectedTracks={setSeedTracks} loading={loadingTracks} />
          </div>

          <div className="flex flex-col">
            <Label className="mb-2">Seed Genres</Label>
            <GenresCombobox selectedGenres={seedGenres} updateSelectedGenres={setSeedGenres} />
          </div>

          <div className="flex flex-col">
            <Label className="mb-2">Track Attributes</Label>
            <div className="grid grid-cols-2 gap-1.5">
              {TRACK_ATTRIBUTES.map((attribute) => (
                <Toggle key={attribute.value} variant="outline" size="sm">
                  {attribute.label}
                </Toggle>
              ))}
            </div>
          </div>

          <div className="flex flex-col">
            <div className="mb-2 flex items-center">
              <Label htmlFor="acousticness">Acousticness</Label>

              <span className="ml-auto text-sm text-gray-500 dark:text-gray-400">
                {acousticness[0]} &ndash; {acousticness[2]}
              </span>
            </div>
            <Slider
              id="acousticness"
              defaultValue={[0, 0.5, 1]}
              max={1}
              step={0.01}
              value={acousticness}
              onValueChange={setAcousticness}
            />
          </div>
        </div>
      </div>

      {/* The Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800">
        <div className="px-6 py-3">
          <Button asChild className="w-full">
            <Link href={`/reccomendations?${urlParams}`} onClick={(event) => validateParams(event)}>
              Get Reccomendations
            </Link>
          </Button>
        </div>

        <div className="flex justify-between border-t border-gray-200 px-6 py-3 dark:border-gray-800">
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="text-left">
                <div className="flex items-center gap-x-2">
                  <Image
                    className="h-10 w-10 rounded-full bg-gray-50"
                    height={40}
                    width={40}
                    src={session.user.image!}
                    alt="User's profile picture on Spotify"
                  />
                  <div className="flex flex-col">
                    <div className="text-sm font-medium">{session.user.name}</div>
                    <div className="text-xs text-gray-500">{session.user.email}</div>
                  </div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => signOut()}>Log Out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <SignInButton size="sm" variant="secondary" />
          )}
          <ThemeToggle />
        </div>
      </footer>
    </aside>
  );
}
