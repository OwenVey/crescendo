import type { Track } from '@spotify/web-api-ts-sdk';
import Image from 'next/image';

type TrackCardProps = {
  track: Track;
};

export function TrackCard({ track }: TrackCardProps) {
  return (
    <div className="group">
      {track.album.images[0] ? (
        <Image
          className="h-52 w-52 rounded-2xl group-hover:opacity-75"
          src={track.album.images[0]?.url}
          width={208}
          height={208}
          alt={`Album cover for ${track.name}`}
        />
      ) : (
        <div className="h-52 w-52 rounded-2xl bg-red-200">no image</div>
      )}
      <div className="mt-1 w-52">
        <div className="truncate text-sm font-semibold">{track.name}</div>
        <div className="truncate text-xs text-gray-500 dark:text-gray-400">
          {track.artists.map((a) => a.name).join(', ')}
        </div>
      </div>
    </div>
  );
}
