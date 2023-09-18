'use client';
import { ArtistsCombobox } from '@/components/artists-combobox';
import { GenresCombobox } from '@/components/genres-combobox';
import { SelectedArtist } from '@/components/selected-artist';
import { SelectedTrack } from '@/components/selected-track';
import { TracksCombobox } from '@/components/tracks-combobox';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Slider } from '@/components/ui/slider';
import { Toggle } from '@/components/ui/toggle';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/components/ui/use-toast';
import { GENRES, TRACK_ATTRIBUTES, TrackAttributesSchema } from '@/lib/constants';
import { useSpotifySdk } from '@/lib/hooks/useSpotifySdk';
import { arrayToURLSearchParams, objectToURLSearchParams, searchParamsToObject } from '@/lib/utils';
import type { SliderValue, TrackAttribute, TrackAttributeWithValue } from '@/types';
import type { Artist, Track } from '@spotify/web-api-ts-sdk';
import { InfoIcon, RotateCcwIcon, Wand2Icon, XIcon } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { LoadingArtist } from './loading-artist';
import { LoadingTrack } from './loading-track';
import { Badge } from './ui/badge';

export function SearchFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const sdk = useSpotifySdk();
  const { data: session } = useSession();

  const paramAttributes = useMemo(
    () => TrackAttributesSchema.parse(searchParamsToObject(searchParams)),
    [searchParams],
  );

  const [seedArtists, setSeedArtists] = useState<Array<Artist>>([]);
  const [seedTracks, setSeedTracks] = useState<Array<Track>>([]);
  const [seedGenres, setSeedGenres] = useState<Array<string>>(paramAttributes.seed_genres);

  const [loadingArtists, setLoadingArtists] = useState(
    !!paramAttributes.seed_artists.length && seedArtists.length === 0,
  );
  const [loadingTracks, setLoadingTracks] = useState(!!paramAttributes.seed_tracks.length && seedTracks.length === 0);
  const [smartLoading, setSmartLoading] = useState(false);

  const [enabledAttributes, setEnabledAttributes] = useState<Array<TrackAttributeWithValue>>(() => {
    return TRACK_ATTRIBUTES.filter((attribute) => {
      const min = paramAttributes[`min_${attribute.id}`];
      const target = paramAttributes[`target_${attribute.id}`];
      const max = paramAttributes[`max_${attribute.id}`];

      return !!min || !!target || !!max;
    }).map((attribute) => {
      const min = paramAttributes[`min_${attribute.id}`];
      const target = paramAttributes[`target_${attribute.id}`];
      const max = paramAttributes[`max_${attribute.id}`];
      return { ...attribute, value: [min, target, max].filter((x) => x !== undefined) as SliderValue };
    });
  });

  const [urlParams, setUrlParams] = useState('');

  useEffect(() => {
    console.log('Updating urlParams');

    const trackAttributes = enabledAttributes.reduce((attributeParams, attribute) => {
      let min: number | undefined = undefined;
      let target: number | undefined = undefined;
      let max: number | undefined = undefined;
      switch (attribute.defaultValue.length) {
        case 1: {
          target = attribute.value[0];
          break;
        }
        case 2: {
          min = attribute.value[0];
          max = attribute.value[1];
          break;
        }
        case 3: {
          min = attribute.value[0];
          target = attribute.value[1];
          max = attribute.value[2];
          break;
        }
      }

      return {
        ...attributeParams,
        ...(min !== undefined && { [`min_${attribute.id}`]: min }),
        ...(target !== undefined && { [`target_${attribute.id}`]: target }),
        ...(max !== undefined && { [`max_${attribute.id}`]: max }),
      };
    }, {});

    const params = objectToURLSearchParams({
      seed_artists: seedArtists.map(({ id }) => id),
      seed_tracks: seedTracks.map(({ id }) => id),
      seed_genres: seedGenres,
      ...trackAttributes,
    });

    setUrlParams(params.toString());
  }, [seedArtists, seedTracks, seedGenres, enabledAttributes]);

  useEffect(() => {
    console.log('Syncing artists params with state...');

    const ids = paramAttributes.seed_artists;
    if (ids.length === 0) {
      setSeedArtists([]);
      setLoadingArtists(false);
    } else {
      seedArtists.length === 0 && getArtists();
    }

    async function getArtists() {
      const idsParams = arrayToURLSearchParams('ids', ids).toString();
      try {
        setLoadingArtists(true);
        const artists: Array<Artist> = await (await fetch(`/api/artists?${idsParams}`)).json();
        setSeedArtists(artists);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingArtists(false);
      }
    }
  }, [paramAttributes.seed_artists]);

  useEffect(() => {
    console.log('Syncing tracks params with state...');

    const ids = paramAttributes.seed_tracks;
    if (ids.length === 0) {
      setSeedTracks([]);
      setLoadingTracks(false);
    } else {
      seedTracks.length === 0 && getTracks();
    }

    async function getTracks() {
      const idsParams = arrayToURLSearchParams('ids', ids).toString();
      try {
        setLoadingTracks(true);
        const tracks: Array<Track> = await (await fetch(`/api/tracks?${idsParams}`)).json();
        setSeedTracks(tracks);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingTracks(false);
      }
    }
  }, [paramAttributes.seed_tracks]);

  function isAttributeEnabled(attribute: TrackAttribute) {
    return enabledAttributes.some(({ id }) => id === attribute.id);
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
      setEnabledAttributes([...enabledAttributes, { ...trackAttribute, value: trackAttribute.defaultValue }]);
    } else {
      setEnabledAttributes(enabledAttributes.filter(({ id }) => id !== trackAttribute.id));
    }
  }

  function setAttributeValue(id: string, value: SliderValue) {
    setEnabledAttributes((prevState) => prevState.map((obj) => (obj.id === id ? { ...obj, value } : obj)));
  }

  function getAttributeValueLabel(attribute: TrackAttributeWithValue): string {
    if (attribute.formatter) {
      return attribute.formatter(attribute.value);
    }

    const unit = attribute.unit ? attribute.unit : '';

    const [first, second] = attribute.value;

    switch (attribute.value.length) {
      case 1:
        return `${first} ${unit}`;
      case 2:
        return `${first}–${second} ${unit}`;
      case 3:
        return `${second} ${unit}`;
    }
  }

  function addArtist(artist: Artist) {
    setSeedArtists((prev) => [...prev, artist]);
  }

  function removeArtist(artist: Artist) {
    setSeedArtists((prev) => prev.filter(({ id }) => id !== artist.id));
  }

  function addTrack(track: Track) {
    setSeedTracks((prev) => [...prev, track]);
  }

  function removeTrack(track: Track) {
    setSeedTracks((prev) => prev.filter(({ id }) => id !== track.id));
  }

  function addGenre(genre: string) {
    setSeedGenres((prev) => [...prev, genre]);
  }

  function removeGenre(genre: string) {
    setSeedGenres((prev) => prev.filter((g) => g !== genre));
  }

  async function smartRecommend() {
    setSmartLoading(true);
    reset();

    try {
      const getSavedAudioFeatures = sdk.currentUser.tracks.savedTracks(50).then(({ items: savedTracks }) => {
        const savedTrackIds = savedTracks.map((t) => t.track.id);
        return sdk.tracks.audioFeatures(savedTrackIds);
      });
      const getTopTracks = sdk.currentUser.topItems('tracks', 'medium_term', 5);
      const getTopArtists = sdk.currentUser.topItems('artists', 'medium_term', 5);
      const [savedAudioFeatures, topTracks, topArtists] = await Promise.all([
        getSavedAudioFeatures,
        getTopTracks,
        getTopArtists,
      ]);

      const numericAttributes = savedAudioFeatures.map(
        ({
          acousticness,
          danceability,
          energy,
          instrumentalness,
          liveness,
          loudness,
          speechiness,
          tempo,
          valence,
        }) => ({
          acousticness,
          danceability,
          energy,
          instrumentalness,
          liveness,
          loudness,
          speechiness,
          tempo,
          valence,
        }),
      );

      const summedAttributes = numericAttributes.reduce((acc, obj) => {
        Object.entries(obj).forEach(([key, value]) => (acc[key as keyof typeof obj] += value));
        return acc;
      });

      const attributes = Object.entries(summedAttributes).map(([key, value]) => {
        const attribute = TRACK_ATTRIBUTES.find((t) => t.id === key)!;
        const average = +(value / savedAudioFeatures.length).toFixed(2);
        return { ...attribute, value: [attribute.min, average, attribute.max] as SliderValue };
      });

      // setSeedArtists(topArtists.items);
      setSeedTracks(topTracks.items);
      setEnabledAttributes(attributes);
    } catch (error) {
      console.error(error);
    } finally {
      setSmartLoading(false);
    }

    // router.push(`/recommendations?${urlParams}`);
  }

  function reset() {
    setSeedArtists([]);
    setSeedTracks([]);
    setSeedGenres([]);
    setEnabledAttributes([]);
    setUrlParams('');
    router.push('/');
  }
  return (
    <>
      {/* Scrollable Content */}
      <ScrollArea type="auto" className="flex-grow px-6 py-3">
        <div className="flex flex-col gap-y-6">
          {/* <div className="flex flex-col">
            <Label className="mb-2">Seed Artists NEW 1</Label>
            <ArtistsSearch artists={seedArtists} add={addArtist} remove={removeArtist} loading={loadingArtists} />
            <div className="mt-2 flex flex-col gap-y-1">
              {seedArtists.map((artist) => (
                <SelectedArtist key={artist.id} artist={artist} remove={removeArtist} />
              ))}
            </div>
          </div> */}

          <div className="flex flex-col">
            <Label className="mb-2">Seed Artists</Label>
            <ArtistsCombobox artists={seedArtists} add={addArtist} remove={removeArtist} />
            <div className="mt-2 flex flex-col gap-y-1">
              {loadingArtists
                ? paramAttributes.seed_artists.map((id) => <LoadingArtist key={id} />)
                : seedArtists.map((artist) => <SelectedArtist key={artist.id} artist={artist} remove={removeArtist} />)}
            </div>
          </div>

          <div className="flex flex-col">
            <Label className="mb-2">Seed Tracks</Label>
            <TracksCombobox tracks={seedTracks} add={addTrack} remove={removeTrack} />
            <div className="mt-2 flex flex-col gap-y-1">
              {loadingTracks
                ? paramAttributes.seed_tracks.map((id) => <LoadingTrack key={id} />)
                : seedTracks.map((track) => <SelectedTrack key={track.id} track={track} remove={removeTrack} />)}
            </div>
          </div>

          <div className="flex flex-col">
            <Label className="mb-2">Seed Genres</Label>
            <GenresCombobox genres={seedGenres} add={addGenre} remove={removeGenre} />
            <div className="mt-2 flex flex-wrap gap-1">
              {seedGenres.map((genre) => (
                <Badge key={genre} className="whitespace-nowrap">
                  {GENRES.find((g) => g.value === genre)?.label}
                  <button
                    className="-mr-1.5 ml-0.5 rounded-full p-[2px] hover:bg-gray-700 dark:hover:bg-gray-300"
                    onClick={() => removeGenre(genre)}
                  >
                    <XIcon className="h-3 w-3" />
                    <span className="sr-only">Remove</span>
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex flex-col">
            <div className="mb-1 flex h-7 items-end justify-between">
              <Label className="mb-1">Track Attributes</Label>
              {enabledAttributes.length > 0 && (
                <Button onClick={() => setEnabledAttributes([])} className="h-full text-xs" variant="outline" size="sm">
                  Clear
                </Button>
              )}
            </div>

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
                  {getAttributeValueLabel(attribute)}
                </span>
              </div>
              <Slider
                id={attribute.id}
                min={attribute.min}
                max={attribute.max}
                defaultValue={attribute.defaultValue}
                step={attribute.step}
                value={attribute.value}
                onValueChange={(value) => setAttributeValue(attribute.id, value as SliderValue)}
              />
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="flex flex-col gap-2 px-6 py-3">
        {seedArtists.length || seedTracks.length || seedGenres.length || enabledAttributes.length ? (
          <Button className="w-full" variant="secondary" onClick={reset}>
            <RotateCcwIcon className="mr-2 h-4 w-4" />
            Reset
          </Button>
        ) : null}
        <div className="flex gap-2">
          <Button variant="primary" asChild className="flex-1">
            <Link href={`/recommendations?${urlParams}`} onClick={(event) => validateParams(event)}>
              Get Recommendations
            </Link>
          </Button>
          <Button
            variant="secondary"
            size="icon"
            onClick={smartRecommend}
            tooltip={session ? 'Smart Recommend' : 'Authorize Spotify to use this feature'}
            loading={smartLoading}
            disabled={!session}
          >
            <Wand2Icon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </>
  );
}
