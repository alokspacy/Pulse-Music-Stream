'use client';

import { useMemo } from 'react';
import { Header } from '../layout/Header';
import {
  CollectionAccentBackground,
  CollectionActions,
  CollectionHero,
  MetaLink,
  MetaSep,
} from '../collection/CollectionPage';
import { TrackList } from '../cards/TrackList';
import { PlayButton } from '../player/PlayButton';
import { useScrollContainer } from '../layout/scroll-context';
import { useCollectionPlayback } from '@/lib/hooks/useCollectionPlayback';
import { ui } from '@/lib/styles';
import { formatLongDuration, pickAccentHex, totalDuration } from '@/lib/utils';
import type { Album } from '@/types';

export function AlbumContent({ album }: { album: Album }) {
  const { scrollRef } = useScrollContainer();
  const accent = useMemo(() => pickAccentHex(album.id), [album.id]);
  const total = totalDuration(album.tracks);
  const { isPlayingThis, onHeaderPlay } = useCollectionPlayback(album.tracks);

  const typeLabel =
    album.type === 'single' ? 'Single' : album.type === 'ep' ? 'EP' : 'Album';

  return (
    <>
      <Header
        scrollContainerRef={scrollRef as React.RefObject<HTMLElement | null>}
        accent={accent}
        stickyContent={
          <>
            <PlayButton
              playing={isPlayingThis}
              onClick={onHeaderPlay}
              size="md"
            />
            <span className="text-base font-bold">{album.title}</span>
          </>
        }
      />

      <CollectionHero
        kind={typeLabel}
        title={album.title}
        coverUrl={album.coverUrl}
        accent={accent}
        meta={
          <>
            <MetaLink href={`/artist/${album.artistId}`}>{album.artist}</MetaLink>
            <MetaSep />
            <span className="text-text-subdued">{album.year}</span>
            <MetaSep />
            <span className="text-text-subdued">
              {album.tracks.length} songs,{' '}
              <span className="text-text-base">
                {formatLongDuration(total)}
              </span>
            </span>
          </>
        }
      />

      <CollectionAccentBackground accent={accent}>
        <CollectionActions
          tracks={album.tracks}
          save={{
            kind: 'album',
            id: album.id,
            title: album.title,
            artist: album.artist,
            artistId: album.artistId,
            coverUrl: album.coverUrl,
            label: {
              saved: 'Added to Your Library',
              unsaved: 'Removed from Your Library',
            },
          }}
        />
        <TrackList
          tracks={album.tracks}
          showAlbum={false}
          showCover={false}
          showDateAdded={false}
        />
        <div className={ui.collectionFooter}>
          &copy; {album.year} - {album.artist}
        </div>
      </CollectionAccentBackground>
    </>
  );
}
