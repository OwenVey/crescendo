'use client';
import { ArtistsCombobox } from '@/components/artists-combobox';
import { GenresCombobox } from '@/components/genres-combobox';
import { TracksCombobox } from '@/components/tracks-combobox';

import { SelectedArtist } from '@/components/selected-artist';
import { SelectedTrack } from '@/components/selected-track';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Slider } from '@/components/ui/slider';
import { Toggle } from '@/components/ui/toggle';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/components/ui/use-toast';
import { TRACK_ATTRIBUTES } from '@/lib/constants';
import { arrayToURLSearchParams, objectToURLSearchParams } from '@/lib/utils';
import type { SliderValue, TrackAttribute, TrackAttributeWithValue } from '@/types';
import type { Artist, Track } from '@spotify/web-api-ts-sdk';
import { InfoIcon, RotateCcwIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export function SearchFilters() {
  const router = useRouter();
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
        if (min || target || max) {
          // if attribute is in URL and already in state, do nothing
          if (isAttributeEnabled(attribute)) return previous;
          // add attribute from URL to state
          return [
            ...previous,
            { ...attribute, value: [min, target, max].filter((x) => !!x).map(Number) as SliderValue },
          ];
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

    const currentIds = seedArtists.map(({ id }) => id);
    const missingIds = ids.filter((id) => !currentIds.includes(id));
    if (missingIds.length === 0) return;

    const idsParams = arrayToURLSearchParams('ids', missingIds).toString();
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

  async function getTracks(ids: Array<string>) {
    if (ids.length === 0) {
      setSeedTracks([]);
      return;
    }

    const currentIds = seedTracks.map(({ id }) => id);
    const missingIds = ids.filter((id) => !currentIds.includes(id));
    if (missingIds.length === 0) return;

    const idsParams = arrayToURLSearchParams('ids', missingIds).toString();
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
            <ArtistsCombobox artists={seedArtists} add={addArtist} remove={removeArtist} loading={loadingArtists} />
            <div className="mt-2 flex flex-col gap-y-1">
              {seedArtists.map((artist) => (
                <SelectedArtist key={artist.id} artist={artist} remove={removeArtist} />
              ))}
            </div>
          </div>

          <div className="flex flex-col">
            <Label className="mb-2">Seed Tracks</Label>
            <TracksCombobox tracks={seedTracks} add={addTrack} remove={removeTrack} loading={loadingTracks} />
            <div className="mt-2 flex flex-col gap-y-1">
              {seedTracks.map((track) => (
                <SelectedTrack key={track.id} track={track} remove={removeTrack} />
              ))}
            </div>
          </div>

          <div className="flex flex-col">
            <Label className="mb-2">Seed Genres</Label>
            <GenresCombobox genres={seedGenres} add={addGenre} remove={removeGenre} />
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

      <div className="flex gap-2 px-6 py-3">
        <Button variant="secondary" size="icon" onClick={reset}>
          <RotateCcwIcon className="h-4 w-4" />
        </Button>
        <Button asChild className="flex-1">
          <Link href={`/reccomendations?${urlParams}`} onClick={(event) => validateParams(event)}>
            Get Reccomendations
          </Link>
        </Button>
      </div>
    </>
  );
}