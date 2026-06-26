'use client';

import { Heart, Link2, MoreHorizontal } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTransition, type ReactNode } from 'react';
import { PlayButton } from '../player/PlayButton';
import { IconButton } from '../ui/IconButton';
import { ItemMenu, type MenuItemDef } from '../ui/Menu';
import { usePlayerStore } from '@/store/playerStore';
import { useLibraryStore } from '@/store/libraryStore';
import { useToastStore } from '@/store/toastStore';
import { cn } from '@/lib/utils';
// import {  } from '@/lib/actions/library';
import type { Track } from '@/types';
import { collectionGradientStyle, ui } from '@/lib/styles';
import {
  toggleFollowArtist as toggleFollowArtistAction,
  toggleSaveAlbum as toggleSaveAlbumAction,
} from '@/lib/actions/library';

// Hero
interface CollectionheroProps {
  kind: string;
  title: string;
  description?: string;
  coverUrl?: string;
  coverNode?: ReactNode;
  meta: ReactNode;
  accent: string;
  circle?: boolean;
}

export function CollectionHero({
  kind,
  title,
  description,
  coverUrl,
  coverNode,
  meta,
  accent,
  circle,
}: CollectionheroProps) {
  return (
    <div
      className="relative"
      style={{
        background: `linear-gradient(180deg,  ${accent} 0%, ${accent} 30%, transparent 100%)`,
      }}>
      <div className="noise absolute inset-0 opacity-30 aria-hidden:" />
      <div className="relative flex flex-col inset-ring-current gap-4 px-4 pb-6 pt-10 text-center sm:flex-row sm:items-center sm:gap-6 sm:px-6 sm:pt-16 sm:text-left">
        <div
          className={cn(
            'shrink-0 overflow-hidden bg-decorative-subdued shadow-[0_8px_60px_rgba(0,0,0,0.5)]',
            'h-[160px] w-[160px] sm:h-[200px] sm:w-[200px] lg:h-[232px] lg:w-[232px]',
            circle ? 'rounded-full' : 'rounded-md',
          )}>
          {coverNode ? (
            coverNode
          ) : coverUrl ? (
            <div className="relative h-full w-full">
              <Image
                src={coverUrl}
                alt={title}
                fill
                sizes="(max-width: 640px) 160px, (max-width: 1024px) 200px, 232px"
                priority
                className="object-cover"
              />
            </div>
          ) : null}
        </div>

        <div className="flex min-w-0 flex-col items-center gap-2 sm:items-start sm:gap-3 sm:pb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-text-base">
            {kind}
          </span>
          <h1 className="wrap-break-word text-3xl font-black leading-tight text-text-base sm:text-5xl lg:text-7xl">
            {title}
          </h1>
          {description && (
            <p className="line-clamp-2 max-w-2xl text-sm text-text-subdued">
              {description}
            </p>
          )}
          <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-sm text-text-base sm:justify-start">
            {meta}
          </div>
        </div>
      </div>
    </div>
  );
}

export function MetaSep() {
  return (
    <span aria-hidden className="text-text-subdued">
      .
    </span>
  );
}

export function MetaLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link href={href} className="font-bold hover:underline">
      {children}
    </Link>
  );
}

// Accent wrapper + empty state

export function CollectionAccentBackground({
  accent,
  children,
}: {
  accent: string;
  children: ReactNode;
}) {
  return (
    <div className="relative" style={collectionGradientStyle(accent)}>
      {children}
    </div>
  );
}

export function EmptyCollectionState({ children }: { children: ReactNode }) {
  return <div className={ui.emptyState}>{children}</div>;
}

// More menu
export interface MoreMenuItem {
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  destructive?: boolean;
}

async function copyCurrentUrl(pushToast: (msg: string) => void) {
  if (typeof window === 'undefined') return;
  const url = window.location.href;
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(url);
      pushToast('Link copied to clipboard');
    } else {
      const ta = document.createElement('textarea');
      ta.value = url;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      pushToast('Linked copied to clipboard');
    }
  } catch {
    pushToast('Could not copy link');
  }
}

export function CollectionMoreMenu({
  label = 'More options',
  size = 24,
  buttonSize = 'lg',
  extraItems = [],
}: {
  label?: string;
  size?: number;
  buttonSize?: 'sm' | 'md' | 'lg';
  extraItems?: MoreMenuItem[];
}) {
  const pushToast = useToastStore((s) => s.push);

  const items: MenuItemDef[] = [
    {
      label: 'Copy link',
      icon: <Link2 size={16} />,
      onClick: () => void copyCurrentUrl(pushToast),
    },
    ...extraItems,
  ];

  return (
    <ItemMenu
      items={items}
      trigger={({
        onClick,
        'aria-haspopup': haspopup,
        'aria-expanded': expanded,
      }) => (
        <IconButton
          label={label}
          size={buttonSize}
          aria-haspopup={haspopup}
          aria-expanded={expanded}
          onClick={onClick}>
          <MoreHorizontal size={size} />
        </IconButton>
      )}
    />
  );
}

// Action row (play + save + more)
interface CollectionActionsProps {
  tracks: Track[];
  save?: {
    kind: 'playlist' | 'album' | 'artist';
    id: string;
    title?: string;
    artist?: string;
    artistId?: string;
    coverUrl?: string;
    imageUrl?: string;
    label: { saved: string; unsaved: string };
  };
  extraMenuItems?: MoreMenuItem[];
}

export function CollectionActions({
  tracks,
  save,
  extraMenuItems,
}: CollectionActionsProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const currentTrack = usePlayerStore((s) => s.currentTrack);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const { play, togglePlay } = usePlayerStore((s) => s.actions);

  const savedPlaylistIds = useLibraryStore((s) => s.savedPlaylistIds);
  const savedAlbumIds = useLibraryStore((s) => s.savedAlbumIds);
  const followedArtistIds = useLibraryStore((s) => s.followedArtistIds);
  const toggleSavePlylist = useLibraryStore((s) => s.toggleSavePlaylist);
  const toggleSaveAlbum = useLibraryStore((s) => s.toggleSaveAlbum);
  const toggleFollowArtist = useLibraryStore((s) => s.toggleFollowArtist);
  const pushToast = useToastStore((s) => s.push);
  const [, startTransition] = useTransition();

  const isInCollection =
    currentTrack && tracks.some((t) => t.id === currentTrack.id);

  const isPlayingThis = Boolean(isInCollection && isPlaying);

  const onPlay = () => {
    if (isInCollection) togglePlay();
    else if (tracks[0]) play(tracks[0], tracks);
  };

  const saved = save
    ? save.kind === 'playlist'
      ? savedPlaylistIds.includes(save.id)
      : save.kind === 'album'
        ? savedAlbumIds.includes(save.id)
        : followedArtistIds.includes(save.id)
    : false;

  const onSave = () => {
    if (!save) return;
    if (!session?.user) {
      pushToast('Log in to save to your library');
      router.push('/login');
      return;
    }

    if (save.kind === 'playlist') toggleSavePlylist(save.id);
    else if (save.kind === 'album') toggleSaveAlbum(save.id);
    else toggleFollowArtist(save.id);
    pushToast(saved ? save.label.unsaved : save.label.saved);

    startTransition(async () => {
      try {
        if (save.kind === 'album') {
          await toggleSaveAlbumAction({
            id: save.id,
            title: save.title ?? '',
            artist: save.artist ?? '',
            artistId: save.artistId,
            coverUrl: save.coverUrl,
          });
        } else if (save.kind === 'artist') {
          await toggleFollowArtistAction({
            id: save.id,
            name: save.title ?? '',
            imageUrl: save.imageUrl ?? save.coverUrl,
          });
        }
        router.refresh();
      } catch {
        if (save.kind === 'playlist') toggleSavePlylist(save.id);
        else if (save.kind === 'album') toggleSaveAlbum(save.id);
        else toggleFollowArtist(save.id);
        pushToast('Could not update your library');
      }
    });
  };

  return (
    <div className="flex items-center gap-4 px-4 py-5 sm:gap-6 sm:px-6 sm:py-6">
      <PlayButton playing={isPlayingThis} onClick={onPlay} size="xl" />
      {save && (
        <button
          type="button"
          onClick={onSave}
          aria-label={saved ? save.label.unsaved : save.label.saved}
          className="transition hover:scale-105">
          <Heart
            size={28}
            className={
              saved ? ui.heartActive : 'text-text-subdued hover:text-text-base'
            }
          />
        </button>
      )}
      <CollectionMoreMenu extraItems={extraMenuItems} />
    </div>
  );
}
