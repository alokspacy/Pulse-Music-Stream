'use client';

import { Clock } from 'lucide-react';
import { TrackRow } from './TrackRow';
import type { Track } from '@/types';

interface TrackListProps {
  tracks: Track[];
  showAlbum?: boolean;
  showCover?: boolean;
  showDateAdded?: boolean;
}

export function TrackList({
  tracks,
  showAlbum = true,
  showCover = true,
  showDateAdded = true,
}: TrackListProps) {
  return (
    <div className="px-2 sm:px-4">
      <div
        className="sticky top-0 z-10 mb-2 hidden grid-cols-[40px_1fr_80px] gap-4 border-b border-white/10 bg-bg-base/70 px-4 py-2 text-xs uppercase tracking-wider text-text-subdued backdrop-blur sm:top-[64px] sm:grid
      md:grid-cols-[40px_minmax(0,4fr)_minmax(0,3fr)_minmax(0,1fr)]
      lg:grid-cols-[40px_minmax(0,4fr)_minmax(0,3fr)_minmax(0,2fr)_minmax(0,1fr)]
      ">
        <span className="text-center">#</span>
        <span>Title</span>
        {showAlbum && <span className="hidden md:block">Album</span>}
        {showDateAdded && <span className="hidden lg:block">Date added</span>}
        <span className="flex justify-end">
          <Clock size={16} aria-label="Duration" />
        </span>
      </div>
      <div className="flex flex-col">
        {tracks.map((t, i) => (
          <TrackRow
            key={`${t.id}-${i}`}
            track={t}
            index={i}
            queue={tracks}
            showAlbum={showAlbum}
            showCover={showCover}
            showDateAdded={showDateAdded}
          />
        ))}
      </div>
    </div>
  );
}
