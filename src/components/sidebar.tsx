'use client';
import logo from '@/app/logo.png';
import { ArtistCombobox } from '@/components/artist-combobox';
import { GenreCombobox } from '@/components/genre-combobox';
import { SignInButton } from '@/components/sign-in-button';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button, Checkbox, Label, Slider } from '@/components/ui';
import { objectToURLSearchParams } from '@/lib/utils';
import type { Artist } from '@spotify/web-api-ts-sdk';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export function Sidebar() {
  const { data: session } = useSession();
  const [genres, setGenres] = useState<Array<string>>([]);
  const [artists, setArtists] = useState<Array<Artist>>([]);
  const [acousticness, setAcousticness] = useState([0, 0.5, 1]);
  const [urlParams, setUrlParams] = useState('');

  useEffect(() => {
    const params = objectToURLSearchParams({
      seed_artists: artists.map((a) => a.id),
      seed_genres: genres,
      min_acousticness: acousticness[0],
      target_acousticness: acousticness[1],
      max_acousticness: acousticness[2],
    });

    setUrlParams(params.toString());
  }, [artists, genres, acousticness]);

  return (
    <div className="fixed inset-y-0 z-50 flex w-72 flex-col">
      {/* Sidebar component, swap this element with another sidebar if you like */}
      <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 dark:border-gray-800 dark:bg-gray-950">
        <div className="flex h-16 shrink-0 items-center">
          <Link href="/" className="flex items-center">
            <Image src={logo} alt="Logo" className="h-10 w-10" />
            <span className="ml-2 text-xl font-bold">Crescendo</span>
          </Link>
        </div>

        <div className="flex flex-1 flex-col">
          <div className="flex flex-col gap-y-4">
            <div className="flex flex-col">
              <Label className="mb-2">Seed Artists</Label>
              <ArtistCombobox selectedArtists={artists} updateArtists={setArtists} />
            </div>

            <div className="flex flex-col">
              <Label className="mb-2">Seed Genres</Label>
              <GenreCombobox selectedGenres={genres} updateGenres={setGenres} />
            </div>

            <div className="flex flex-col">
              <div className="mb-2 flex items-center">
                <Label htmlFor="acousticness">Acousticness</Label>
                <Checkbox className="ml-2" />
                <span className="text-sm text-gray-500 dark:text-gray-400 ml-auto">
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

          <Button asChild className="my-4">
            <Link href={`/reccomendations?${urlParams}`}>Get Reccomendations</Link>
          </Button>

          <div className="-mx-6 mt-auto border-t border-gray-200 dark:border-gray-800">
            <div className="flex justify-between px-6 py-3">
              {session ? (
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
              ) : (
                <SignInButton size="sm" />
              )}
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
