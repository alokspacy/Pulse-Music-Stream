'use client';

import { motion } from 'framer-motion';
import { useEffect, useState, useTransition } from 'react';
import { ContentCard } from '../cards/ContentCard';
import { QuickAccessCard } from '../cards/QuickAccessCard';
import { SectionRow } from '../cards/SectionRow';
import { cn, getGreeting } from '@/lib/utils';
import { ui } from '@/lib/styles';
import { useScrollContainer } from '../layout/scroll-context';
import type { HomeFeed } from '@/lib/catalogues';
import type { Track } from '@/types';
import { Header } from '../layout/Header';
import { usePlayerStore } from '@/store/playerStore';
import { useToastStore } from '@/store/toastStore';
import {
  getPlayableAlbumTracks,
  getPlayablePlaylistTracks,
} from '@/lib/catalogue-actions';

interface Props {
  feed: HomeFeed;
}

export function HomeContent({ feed }: Props) {
  const { scrollRef } = useScrollContainer();
  const play = usePlayerStore((s) => s.actions.play);
  const pushToast = useToastStore((s) => s.push);
  const [, startTransition] = useTransition();

  const [greeting, setGreeting] = useState(() => getGreeting());
  useEffect(() => {
    const id = window.setInterval(() => setGreeting(getGreeting()), 60_000);
    return () => window.clearInterval(id);
  }, []);

  const playTracks = (tracks: Track[]) => {
    if (!tracks[0]) {
      pushToast('No playable tracks found for this collection');
      return;
    }
    play(tracks[0], tracks);
  };

  const playPlaylist = (id: string, initialTracks: Track[]) => {
    if (initialTracks[0]) {
      playTracks(initialTracks);
      return;
    }
    startTransition(async () => {
      try {
        const tracks = await getPlayablePlaylistTracks(id);
        playTracks(tracks);
      } catch {
        pushToast('Could not load this playlist');
      }
    });
  };

  const playAlbum = (id: string, initialTracks: Track[]) => {
    if (initialTracks[0]) {
      playTracks(initialTracks);
      return;
    }
    startTransition(async () => {
      try {
        const tracks = await getPlayableAlbumTracks(id);
        playTracks(tracks);
      } catch {
        pushToast('Could not load this album');
      }
    });
  };

  return (
    <>
      <Header
        scrollContainerRef={scrollRef as React.RefObject<HTMLElement | null>}
        accent="linear-gradient(180deg,#23163a 0%,#121212 100%)"
        stickyContent={<span className="text-base font-bold">Home</span>}
      />
      <div className="relative">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-[-72px] h-[440px] bg-linear-to-b from-pulse-accent-dim/40 via-bg-base to-bg-base"
        />
        <div className={cn('relative pt-2', ui.pagePadding)}>
          <motion.h1
            key={greeting}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="mb-6 text-2xl font-black text-text-base sm:text-3xl">
            {greeting}
          </motion.h1>

          {feed.quickAccess.length > 0 && (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {feed.quickAccess.map((item) => (
                <QuickAccessCard
                  key={item.id}
                  imageUrl={item.coverUrl}
                  title={item.title}
                  href={item.href}
                  onPlay={() => {
                    if (item.id === 'liked') return;
                    const p = feed.madeForYou.find((x) => x.id === item.id);
                    if (p) {
                      playPlaylist(p.id, p.tracks);
                      return;
                    }
                    const a = feed.popularAlbums.find((x) => x.id === item.id);
                    if (a) playAlbum(a.id, a.tracks);
                  }}
                />
              ))}
            </div>
          )}

          <div className="mt-10 flex flex-col gap-10">
            {feed.madeForYou.length > 0 && (
              <SectionRow title="Made For You" href="/library">
                {feed.madeForYou.map((p) => (
                  <ContentCard
                    key={p.id}
                    imageUrl={p.coverUrl}
                    title={p.title}
                    subtitle={p.description}
                    href={`/playlist/${p.id}`}
                    onPlay={() => playPlaylist(p.id, p.tracks)}
                  />
                ))}
              </SectionRow>
            )}

            {feed.popularAlbums.length > 0 && (
              <SectionRow title="Popular Albums" href="/library">
                {feed.popularAlbums.map((a) => (
                  <ContentCard
                    key={a.id}
                    imageUrl={a.coverUrl}
                    title={a.title}
                    subtitle={a.artist}
                    href={`/album/${a.id}`}
                    variant="album"
                    onPlay={() => playAlbum(a.id, a.tracks)}
                  />
                ))}
              </SectionRow>
            )}

            {feed.popularArtists.length > 0 && (
              <SectionRow title="Popular Artists" href="/library">
                {feed.popularArtists.map((a) => (
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
            )}

            {feed.newReleases.length > 0 && (
              <SectionRow title="New Releases" href="/library">
                {feed.newReleases.map((a) => (
                  <ContentCard
                    key={a.id}
                    imageUrl={a.coverUrl}
                    title={a.title}
                    subtitle={a.artist}
                    href={`/album/${a.id}`}
                    variant="album"
                    onPlay={() => playAlbum(a.id, a.tracks)}
                  />
                ))}
              </SectionRow>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
