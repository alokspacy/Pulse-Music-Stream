'use client';

import { BadgeCheck } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState, useTransition } from 'react';
import { Header } from '../layout/Header';
import { PlayButton } from '../player/PlayButton';
import { TrackRow } from '../cards/TrackRow';
import { ContentCard } from '../cards/ContentCard';
import { SectionRow } from '../cards/SectionRow';
import { CollectionMoreMenu } from '../collection/CollectionPage';
import { useScrollContainer } from '../layout/scroll-context';
import { formatNumber, pickAccentHex } from '@/lib/utils';
import { useLibraryStore } from '@/store/libraryStore';
import { usePlayerStore } from '@/store/playerStore';
import { useToastStore } from '@/store/toastStore';
import { toggleFollowArtist as toggleFollowArtistAction } from '@/lib/actions/library';
import type { Artist } from '@/types';

type DiscoFilter = 'all' | 'album' | 'single' | 'ep';

interface Props {
  artist: Artist;
  similar: Artist[];
}

export function ArtisContent({ artist, similar }: Props) {
  const { scrollRef } = useScrollContainer();
  const [showAll, setShowAll] = useState(false);
  const [discoFilter, setDiscoFilter] = useState<DiscoFilter>('all');
  const [, startTransition] = useTransition();

  const followed = useLibraryStore((s) =>
    s.followedArtistIds.includes(artist.id),
  );
  const toggleFollowLocal = useLibraryStore((s) => s.toggleFollowArtist);
  const pushToast = useToastStore((s) => s.push);
  const currentTrack = usePlayerStore((s) => s.currentTrack);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const { play, togglePlay } = usePlayerStore((s) => s.actions);

  const accent = useMemo(() => pickAccentHex(artist.id), [artist.id]);

  const popular = showAll
    ? artist.popularTracks.slice(0, 10)
    : artist.popularTracks.slice(0, 5);

  const queue = artist.popularTracks;
  const isInQueue = currentTrack && queue.some((t) => t.id === currentTrack.id);
  const isPlayingThis = Boolean(isInQueue && isPlaying);

  const onPlayArtist = () => {
    if (isInQueue) togglePlay();
    else if (queue[0]) play(queue[0], queue);
  };

  const filteredAlbums =
    discoFilter === 'all'
      ? artist.albums
      : artist.albums.filter((a) => a.type === discoFilter);

  const onToggleFollow = () => {
    toggleFollowLocal(artist.id);
    pushToast(
      followed ? `Unfollowed ${artist.name}` : `Following ${artist.name}`,
    );
    startTransition(async () => {
      try {
        await toggleFollowArtistAction({
          id: artist.id,
          name: artist.name,
          imageUrl: artist.imageUrl,
        });
      } catch {
        toggleFollowLocal(artist.id);
        pushToast('Sign in to follow artist');
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
              onClick={onPlayArtist}
              size="md"
            />
            <span className="text-base font-bold">{artist.name}</span>
          </>
        }
      />

      <div className="relative h-[260px] sm:h-[340px] lg:h-[400px]">
        <div className="absolute inset-0">
          <Image
            src={artist.bannerUrl ?? artist.imageUrl}
            alt={artist.name ?? ''}
            fill
            priority
            sizes="(max-width: 768px) 100vw, calc(100vw - 340px)"
            className="object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.45) 60%, rgba(0,0,0,0.95) 100%)',
            }}
          />
        </div>

        <div className="relative flex h-full flex-col justify-end gap-2 px-4 pb-5 sm:gap-3 sm:px-6 sm:pb-6">
          {artist.verified && (
            <div className="flex items-center gap-2 text-sm text-text-base">
              <BadgeCheck size={20} className="fill-[#4cb3ff] text-black" />
              <span>Verified Artist</span>
            </div>
          )}
          <h1 className="wrap-break-word text-4xl font-black leading-none text-text-base sm:text-6xl lg:text-8xl drop-shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
            {artist.name}
          </h1>
          <p className="text-sm text-text-base">
            {formatNumber(artist.monthlyListeners)} monthly listeners
          </p>
        </div>
      </div>

      <div
        className="relative"
        style={{
          background: `linear-gradient(180deg, ${accent}cc 0%, transparent 240px)`,
        }}>
        <div className="flex flex-wrap items-center gap-4 px-4 py-5 sm:gap-6 sm:px-6 sm:py-6">
          <PlayButton
            playing={isPlayingThis}
            onClick={onPlayArtist}
            size="xl"
          />
          <button
            type="button"
            onClick={onToggleFollow}
            className={`rounded-full border px-4 py-1.5 text-sm font-bold transition ${
              followed
                ? 'border-white/40 bg-white/10 text-text-base hover:border-white'
                : 'border-white/60 text-text-base hover:border-white hover:scale-105'
            }`}>
            {followed ? 'Following' : 'Follow'}
          </button>
          <CollectionMoreMenu size={28} />
        </div>

        {popular.length > 0 && (
          <section className="px-4 pb-8 sm:px-6">
            <h2 className="mb-4 text-2xl font-bold text-text-base">Popular</h2>
            <div className="flex flex-col gap-1">
              {popular.map((t, i) => (
                <TrackRow
                  key={t.id}
                  index={i}
                  track={t}
                  queue={queue}
                  showAlbum={false}
                  showDateAdded={false}
                />
              ))}
            </div>
            {artist.popularTracks.length > 5 && (
              <button
                type="button"
                onClick={() => setShowAll((v) => !v)}
                className="mt-4 text-sm font-bold text-text-subdued hover:text-text-base">
                {showAll ? 'Show less' : 'See more'}
              </button>
            )}
          </section>
        )}

        {artist.albums.length > 0 && (
          <section className="px-4 pb-8 sm:px-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-text-base">Discography</h2>
              <Link
                href={`/artist/${artist.id}`}
                className="text-sm font-bold text-text-subdued hover:underline">
                Show all
              </Link>
            </div>
            <div className="mb-4 flex flex-wrap gap-2">
              {(
                [
                  { id: 'all', label: 'Popular releases' },
                  { id: 'album', label: 'Albums' },
                  { id: 'single', label: 'Singles & EPs' },
                ] as { id: DiscoFilter; label: string }[]
              ).map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setDiscoFilter(f.id)}
                  className={`rounded-full px-3 py-1.5 text-sm transition ${
                    discoFilter === f.id
                      ? 'bg-white text-black'
                      : 'bg-white/10 text-text-base hover:bg-white/20'
                  }`}>
                  {f.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-[repeat(auto-fill,mimax(140px,1fr))] gap-3 sm:grid-cols-[repeat(auto-fill,minmax(170px,1fr))] sm:gap-4">
              {filteredAlbums.map((al) => (
                <ContentCard
                  key={al.id}
                  imageUrl={al.coverUrl}
                  title={al.title}
                  subtitle={`${al.year} . ${
                    al.type === 'ep'
                      ? 'EP'
                      : al.type[0].toUpperCase() + al.type.slice(1)
                  }`}
                  href={`/album/${al.id}`}
                  variant="album"
                  onPlay={() => al.tracks[0] && play(al.tracks[0], al.tracks)}
                />
              ))}
              {filteredAlbums.length === 0 && (
                <p className="text-sm text-text-subdued">Nothing here yet.</p>
              )}
            </div>
          </section>
        )}

        {artist.bio && (
          <section className="px-4 pb-8 sm:px-6">
            <h2 className="mb-4 text-2xl font-bold text-text-base">About</h2>
            <div className="relative max-w-3xl overflow-hidden rounded-xl bg-bg-elevated-base p-6">
              <p className="text-sm leading-relaxed text-text-base">
                {artist.bio}
              </p>
              <p className="mt-3 text-sm text-text-subdued">
                {formatNumber(artist.monthlyListeners)} monthly listeners
              </p>
            </div>
          </section>
        )}

        {similar.length > 0 && (
          <div className="px-4 pb-16 sm:px-6">
            <SectionRow title="Fans also like">
              {similar.map((a) => (
                <ContentCard
                  key={a.id}
                  imageUrl={a.imageUrl}
                  title={a.name}
                  subtitle="Artist"
                  href={`/artist/${a.id}`}
                  variant="artist"
                />
              ))}
            </SectionRow>
          </div>
        )}
      </div>
    </>
  );
}
