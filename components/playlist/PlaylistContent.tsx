'use client';

import { Pencil, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo, useState, useTransition } from 'react';
import { Header } from '../layout/Header';
import {
  CollectionAccentBackground,
  CollectionActions,
  CollectionHero,
  EmptyCollectionState,
  MetaLink,
  MetaSep,
  type MoreMenuItem,
} from '../collection/CollectionPage';
import { TrackList } from '../cards/TrackList';
import { PlaylistCover } from '../ui/PlaylistCover';
import { useScrollContainer } from '../layout/scroll-context';
import { useCollectionPlayback } from '@/lib/hooks/useCollectionPlayback';
import { useToastStore } from '@/store/toastStore';
import { PlayButton } from '../player/PlayButton';
import { ui } from '@/lib/styles';
import {
  formatLongDuration,
  formatNumber,
  pickAccentHex,
  totalDuration,
} from '@/lib/utils';
import type { Playlist } from '@/types';
import { deletePlaylist } from '@/lib/actions/playlists';
import { RenamePlaylistDialog } from './RenamePlaylistDialog';

interface Props {
  playlist: Playlist;
  ownedByMe?: boolean;
}

export function PlaylistContent({ playlist, ownedByMe = false }: Props) {
  const { scrollRef } = useScrollContainer();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [renameOpen, setRenameOpen] = useState(false);
  const pushToast = useToastStore((s) => s.push);

  const accent = useMemo(() => pickAccentHex(playlist.id), [playlist.id]);
  const total = totalDuration(playlist.tracks);
  const { isPlayingThis, onHeaderPlay } = useCollectionPlayback(
    playlist.tracks,
  );

  // Owner-only
  const extramenuItems = useMemo<MoreMenuItem[]>(
    () =>
      ownedByMe
        ? [
            {
              label: 'Edit details',
              icon: <Pencil size={16} />,
              onClick: () => setRenameOpen(true),
            },
          ]
        : [],
    [ownedByMe],
  );

  const onDelete = () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      window.setTimeout(() => setConfirmDelete(false), 4000);
      return;
    }

    startTransition(async () => {
      try {
        await deletePlaylist(playlist.id);
        pushToast('Playlist deleted');
        router.push('/library');
        router.refresh();
      } catch {
        pushToast('Could not delete playlist');
      }
    });
  };

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
            <span className="text-base font-bold">{playlist.title}</span>
          </>
        }
      />

      <CollectionHero
        kind="Playlist"
        title={playlist.title}
        description={playlist.description}
        coverUrl={playlist.coverUrl}
        coverNode={
          playlist.coverUrl ? undefined : (
            <PlaylistCover className="h-full w-full" iconSize={64} />
          )
        }
        accent={accent}
        meta={
          <>
            <MetaLink href="/">{playlist.owner}</MetaLink>
            {playlist.followers > 0 && (
              <>
                <MetaSep />
                <span className="text-text-subdued">
                  {formatNumber(playlist.followers)} likes
                </span>
              </>
            )}
            <MetaSep />
            <span className="text-text-subdued">
              {playlist.tracks.length} songs,{' '}
              <span className="text-text-base">
                {formatLongDuration(total)}
              </span>
            </span>
          </>
        }
      />

      <CollectionAccentBackground accent={accent}>
        <div className="flex items-center justify-between gap-3 pr-4 sm:pr-6">
          <CollectionActions
            tracks={playlist.tracks}
            save={
              ownedByMe
                ? undefined
                : {
                    kind: 'playlist',
                    id: playlist.id,
                    label: {
                      saved: 'Added to Your Library',
                      unsaved: 'Removed from Your Library',
                    },
                  }
            }
            extraMenuItems={extramenuItems}
          />

          {ownedByMe && (
            <button
              type="button"
              onClick={onDelete}
              disabled={pending}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-semibold transform ${
                confirmDelete
                  ? 'border-red-400 bg-red-500/15 text-red-200'
                  : 'border-white/20 text-text-subdued hover:border-white/60 hover:text-text-base'
              }`}>
              <Trash2 size={16} />
              {confirmDelete ? 'Click to confirm' : 'Delete playlist'}
            </button>
          )}
        </div>
        {playlist.tracks.length > 0 ? (
          <TrackList tracks={playlist.tracks} />
        ) : (
          <EmptyCollectionState>
            This playlist is empty. Find a song you like and hit the menu on the
            track row to add it here.
          </EmptyCollectionState>
        )}
        <div className={ui.collectionFooter}>
          <p>&copy; 2026 Pulse Music Stream</p>
        </div>
      </CollectionAccentBackground>

      {ownedByMe && (
        <RenamePlaylistDialog
          open={renameOpen}
          onClose={() => setRenameOpen(false)}
          playlistId={playlist.id}
          initialName={playlist.title}
          initialDescription={playlist.description}
        />
      )}
    </>
  );
}
