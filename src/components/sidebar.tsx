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
  ScrollArea,
  Slider,
  Toggle,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  useToast,
} from '@/components/ui';
import { arrayToURLSearchParams, objectToURLSearchParams } from '@/lib/utils';
import type { Artist, Track } from '@spotify/web-api-ts-sdk';
import { InfoIcon, RotateCcw } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const formatMilliseconds = (milliseconds: number): string => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  const paddedSecs = (secs < 10 ? '0' : '') + secs;
  return `${mins}:${paddedSecs}`;
};

const TRACK_ATTRIBUTES: Array<TrackAttribute> = [
  {
    id: 'acousticness',
    label: 'Acousticness',
    description:
      'A confidence measure from 0.0 to 1.0 of whether the track is acoustic. 1.0 represents high confidence the track is acoustic.',
  },
  {
    id: 'danceability',
    label: 'Danceability',
    description:
      'Danceability describes how suitable a track is for dancing based on a combination of musical elements including tempo, rhythm stability, beat strength, and overall regularity. A value of 0.0 is least danceable and 1.0 is most danceable.',
  },
  {
    id: 'duration_ms',
    label: 'Duration',
    description: 'The duration of the track in milliseconds.',
    min: 0,
    max: 600_000,
    step: 1000,
    defaultValue: [0, 300_000, 600_000],
    formatter: formatMilliseconds,
  },
  {
    id: 'energy',
    label: 'Energy',
    description:
      'Energy is a measure from 0.0 to 1.0 and represents a perceptual measure of intensity and activity. Typically, energetic tracks feel fast, loud, and noisy. For example, death metal has high energy, while a Bach prelude scores low on the scale. Perceptual features contributing to this attribute include dynamic range, perceived loudness, timbre, onset rate, and general entropy.',
  },
  {
    id: 'instrumentalness',
    label: 'Instrumentalness',
    description:
      'Predicts whether a track contains no vocals. "Ooh" and "aah" sounds are treated as instrumental in this context. Rap or spoken word tracks are clearly "vocal". The closer the instrumentalness value is to 1.0, the greater likelihood the track contains no vocal content. Values above 0.5 are intended to represent instrumental tracks, but confidence is higher as the value approaches 1.0.',
  },
  {
    id: 'key',
    label: 'Key',
    description:
      'The key the track is in. Integers map to pitches using standard Pitch Class notation. E.g. 0 = C, 1 = C♯/D♭, 2 = D, and so on. If no key was detected, the value is -1.',
    max: 11,
    step: 1,
    defaultValue: [0, 5, 11],
  },
  {
    id: 'liveness',
    label: 'Liveness',
    description:
      'Detects the presence of an audience in the recording. Higher liveness values represent an increased probability that the track was performed live. A value above 0.8 provides strong likelihood that the track is live.',
  },
  {
    id: 'loudness',
    label: 'Loudness',
    description:
      'The overall loudness of a track in decibels (dB). Loudness values are averaged across the entire track and are useful for comparing relative loudness of tracks. Loudness is the quality of a sound that is the primary psychological correlate of physical strength (amplitude). Values typically range between -60 and 0 db.',
    min: -70,
    max: 0,
    step: 1,
    defaultValue: [-70, -35, 0],
    unit: 'db',
  },
  {
    id: 'mode',
    label: 'Mode',
    description:
      'Mode indicates the modality (major or minor) of a track, the type of scale from which its melodic content is derived. Major is represented by 1 and minor is 0.',
    step: 1,
    defaultValue: [0, 0, 1],
  },
  {
    id: 'popularity',
    label: 'Popularity',
    description: `The popularity of the artist. The value will be between 0 and 100, with 100 being the most popular. The artist's popularity is calculated from the popularity of all the artist's tracks.`,
    min: 0,
    max: 100,
    step: 1,
    defaultValue: [0, 50, 100],
  },
  {
    id: 'speechiness',
    label: 'Speechiness',
    description:
      'Speechiness detects the presence of spoken words in a track. The more exclusively speech-like the recording (e.g. talk show, audio book, poetry), the closer to 1.0 the attribute value. Values above 0.66 describe tracks that are probably made entirely of spoken words. Values between 0.33 and 0.66 describe tracks that may contain both music and speech, either in sections or layered, including such cases as rap music. Values below 0.33 most likely represent music and other non-speech-like tracks.',
  },
  {
    id: 'tempo',
    label: 'Tempo',
    description:
      'The overall estimated tempo of a track in beats per minute (BPM). In musical terminology, tempo is the speed or pace of a given piece and derives directly from the average beat duration.',
  },
  {
    id: 'time_signature',
    label: 'Time Signature',
    description:
      'An estimated time signature. The time signature (meter) is a notational convention to specify how many beats are in each bar (or measure). The time signature ranges from 3 to 7 indicating time signatures of "3/4", to "7/4".',
    min: 3,
    max: 7,
    step: 1,
    defaultValue: [3, 5, 7],
  },
  {
    id: 'valence',
    label: 'Valence',
    description:
      'A measure from 0.0 to 1.0 describing the musical positiveness conveyed by a track. Tracks with high valence sound more positive (e.g. happy, cheerful, euphoric), while tracks with low valence sound more negative (e.g. sad, depressed, angry).',
  },
];
type TrackAttribute = {
  id:
    | 'acousticness'
    | 'danceability'
    | 'duration_ms'
    | 'energy'
    | 'instrumentalness'
    | 'key'
    | 'liveness'
    | 'loudness'
    | 'mode'
    | 'popularity'
    | 'speechiness'
    | 'tempo'
    | 'time_signature'
    | 'valence';
  label: string;
  description: string;
  min?: number;
  max?: number;
  defaultValue?: [number, number, number];
  step?: number;
  unit?: string;
  formatter?: (value: number) => string;
};

interface TrackAttributeWithValue extends TrackAttribute {
  value: [number, number, number];
}

export function Sidebar() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [loadingArtists, setLoadingArtists] = useState(false);
  const [loadingTracks, setLoadingTracks] = useState(false);
  const [seedArtists, setSeedArtists] = useState<Array<Artist>>([]);
  const [seedTracks, setSeedTracks] = useState<Array<Track>>([]);
  const [seedGenres, setSeedGenres] = useState<Array<string>>([]);
  const [enabledAttributes, setEnabledAttributes] = useState<Array<TrackAttributeWithValue>>([]);
  const [urlParams, setUrlParams] = useState('');

  useEffect(() => {
    const trackAttributes = enabledAttributes.reduce(
      (acc, current) => ({
        ...acc,
        [`min_${current.id}`]: current.value[0],
        [`target_${current.id}`]: current.value[1],
        [`max_${current.id}`]: current.value[2],
      }),
      {},
    );

    const params = objectToURLSearchParams({
      seed_artists: seedArtists.map(({ id }) => id),
      seed_tracks: seedTracks.map(({ id }) => id),
      seed_genres: seedGenres,
      ...trackAttributes,
    });

    setUrlParams(params.toString());
  }, [seedArtists, seedTracks, seedGenres, enabledAttributes]);

  useEffect(() => {
    console.log('Syncing searchParams with state...');

    const artistIds = searchParams.getAll('seed_artists');
    getArtists(artistIds);

    const trackIds = searchParams.getAll('seed_tracks');
    getTracks(trackIds);

    const genresParam = searchParams.getAll('seed_genres');
    setSeedGenres(genresParam);

    TRACK_ATTRIBUTES.forEach((attribute) => {
      const min = searchParams.get(`min_${attribute.id}`);
      const target = searchParams.get(`target_${attribute.id}`);
      const max = searchParams.get(`max_${attribute.id}`);

      setEnabledAttributes((previous) => {
        // check if attributew is in URL
        if (min && target && max) {
          // if attribute is in URL and already in state, do nothing
          if (isAttributeEnabled(attribute)) return previous;
          // add attribute from URL to state
          return [...previous, { ...attribute, value: [+min, +target, +max] }];
        } else if (isAttributeEnabled(attribute)) {
          // attribute is no longer in URL but is in state, we must remove it
          return previous.filter(({ id }) => id !== attribute.id);
        } else {
          // attribute was not in URL and is not in state, do nothing
          return previous;
        }
      });
    });
    // we only want to watch for searchParams and sync state if they change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  function isAttributeEnabled(attribute: TrackAttribute) {
    return enabledAttributes.some(({ id }) => id === attribute.id);
  }

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

  function toggleAttribute(trackAttribute: TrackAttribute, pressed: boolean) {
    if (pressed) {
      setEnabledAttributes([
        ...enabledAttributes,
        { ...trackAttribute, value: trackAttribute.defaultValue ?? [0, 0.5, 1] },
      ]);
    } else {
      setEnabledAttributes(enabledAttributes.filter(({ id }) => id !== trackAttribute.id));
    }
  }

  function setAttributeValue(id: string, value: [number, number, number]) {
    setEnabledAttributes((prevState) => prevState.map((obj) => (obj.id === id ? { ...obj, value } : obj)));
  }

  function reset() {
    setSeedArtists([]);
    setSeedTracks([]);
    setSeedGenres([]);
    setEnabledAttributes([]);
    setUrlParams('');
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
      <ScrollArea type="auto" className="flex-grow px-6 py-3">
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
                <Toggle
                  key={attribute.id}
                  pressed={isAttributeEnabled(attribute)}
                  onPressedChange={(pressed) => toggleAttribute(attribute, pressed)}
                  variant="outline"
                  size="sm"
                >
                  {attribute.label}
                </Toggle>
              ))}
            </div>
          </div>

          {/* Sliders for enabled track attributes */}
          {enabledAttributes.map((attribute) => (
            <div key={attribute.id} className="flex flex-col">
              <div className="mb-2 flex items-center">
                <Label htmlFor={attribute.id}>{attribute.label}</Label>
                <Tooltip>
                  <TooltipTrigger className="ml-1">
                    <InfoIcon className="h-3 w-3" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>{attribute.description}</p>
                  </TooltipContent>
                </Tooltip>

                <span className="ml-auto text-[13px] text-gray-500 dark:text-gray-400">
                  {/* {attribute.value[0]} &ndash; {attribute.value[2]} */}
                  {attribute.formatter ? attribute.formatter(attribute.value[1]) : attribute.value[1]} {attribute.unit}
                </span>
              </div>
              <Slider
                id={attribute.id}
                min={attribute.min ?? 0}
                max={attribute.max ?? 1}
                defaultValue={attribute.defaultValue ?? [0, 0.5, 1]}
                step={attribute.step ?? 0.01}
                value={attribute.value}
                onValueChange={(value) => setAttributeValue(attribute.id, value as [number, number, number])}
              />
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Footer */}
      <footer className="border-gray-200 dark:border-gray-800">
        <div className="flex gap-2 px-6 py-3">
          <Button variant="secondary" size="icon" onClick={reset}>
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button asChild className="flex-1">
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
