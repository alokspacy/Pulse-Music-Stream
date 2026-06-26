'use client';

import { useCollectionPlayback } from '@/lib/hooks/useCollectionPlayback';
import { TrackList } from '../cards/TrackList';
import {
  CollectionAccentBackground,
  CollectionActions,
  CollectionHero,
  EmptyCollectionState,
  MetaSep,
} from '../collection/CollectionPage';
import { Header } from '../layout/Header';
import { useScrollContainer } from '../layout/scroll-context';
import { LikedSongsCover } from '../ui/LikedSongsCover';
import { formatLongDuration, totalDuration } from '@/lib/utils';
import { PlayButton } from '../player/PlayButton';
import type { Track } from '@/types';

const ACCENT = '#23163a';

interface Props {
  tracks: Track[];
  ownerName: string;
}

export function LikedSongsContent({ tracks, ownerName }: Props) {
  const { scrollRef } = useScrollContainer();
  const total = totalDuration(tracks);
  const { isPlayingThis, onHeaderPlay } = useCollectionPlayback(tracks);

  return (
    <>
      <Header
        scrollContainerRef={scrollRef as React.RefObject<HTMLElement | null>}
        accent={ACCENT}
        stickyContent={
          <>
            <PlayButton
              playing={isPlayingThis}
              onClick={onHeaderPlay}
              size="md"
            />
            <span className="text-base font-bold">Liked Songs</span>
          </>
        }
      />

      <CollectionHero
        kind="playlist"
        title="Liked Songs"
        accent={ACCENT}
        coverNode={<LikedSongsCover className="h-full w-full" iconSize={64} />}
        meta={
          <>
            <span className="font-bold">{ownerName}</span>
            <MetaSep />
            <span className="text-text-subdued">
              {tracks.length} {tracks.length === 1 ? 'song' : 'songs'},{' '}
              <span className="text-text-base">
                {formatLongDuration(total)}
              </span>
            </span>
          </>
        }
      />

      <CollectionAccentBackground accent={ACCENT}>
        <CollectionActions tracks={tracks} />
        {tracks.length > 0 ? (
          <TrackList tracks={tracks} />
        ) : (
          <EmptyCollectionState>
            You haven't liked any songs yet. hit the heart on any track to see
            it here.
          </EmptyCollectionState>
        )}
      </CollectionAccentBackground>
    </>
  );
}
