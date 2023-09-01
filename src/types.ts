export type SliderValue = [number] | [number, number] | [number, number, number];

export type TrackAttribute = {
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
  min: number;
  max: number;
  defaultValue: SliderValue;
  step: number;
  unit?: string;
  formatter?: (value: SliderValue) => string;
};

export interface TrackAttributeWithValue extends TrackAttribute {
  value: SliderValue;
}

export type PageProps = {
  searchParams: { [key: string]: string | string[] | undefined };
};

export type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};
