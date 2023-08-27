'use client';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import logo from '@/app/logo.png';
import { Button, Label, Slider } from '@/components/ui';
import { GenreCombobox } from '@/components/genre-combobox';
import { useEffect, useState } from 'react';
import { ThemeToggle } from '@/components/theme-toggle';

import Link from 'next/link';
import { SignInButton } from './sign-in-button';
import { objectToURLSearchParams } from '@/lib/utils';

export function Sidebar() {
  const { data: session } = useSession();
  const [genres, setGenres] = useState<Array<string>>([]);
  const [acousticness, setAcousticness] = useState([0, 1]);
  const [urlParams, setUrlParams] = useState('');

  useEffect(() => {
    const params = objectToURLSearchParams({
      genres,
      min_acousticness: acousticness[0],
      max_acousticness: acousticness[1],
    });

    setUrlParams(params.toString());
  }, [genres, acousticness]);

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
          <Label className="mb-2">Genres</Label>
          <GenreCombobox selectedGenres={genres} updateGenres={setGenres} />

          <div className="mb-4 mt-8 flex items-center justify-between">
            <Label htmlFor="acousticness">Acousticness</Label>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {acousticness[0]} &ndash; {acousticness[1]}
            </span>
          </div>
          <Slider
            id="acousticness"
            defaultValue={[0, 1]}
            max={1}
            step={0.01}
            value={acousticness}
            onValueChange={setAcousticness}
          />

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
