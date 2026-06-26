'use client';

import { Play, Search as SearchIcon, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { Header } from '../layout/Header';
import { ContentCard } from '../cards/ContentCard';
import { TrackRow } from '../cards/TrackRow';
import { useScrollContainer } from '../layout/scroll-context';
import { usePlayerStore } from '@/store/playerStore';
import { ui } from '@/lib/styles';
import { cn } from '@/lib/utils';
import type { SearchPayload } from '@/lib/catalogues';
import { searchCategories } from '@/lib/search-categories';
import { useDebounce } from '@/lib/hooks/useDebounce';

const EMPTY: SearchPayload = {
  tracks: [],
  artists: [],
  albums: [],
  playlists: [],
  topResult: null,
};

export function SearchContent() {
  return (
    <Suspense fallback={null}>
      <SearchContentInner />
    </Suspense>
  );
}

function SearchContentInner() {
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get('q') ?? '';
  return <SearchContentBody key={urlQuery} initialQuery={urlQuery} />;
}

function SearchContentBody({ initialQuery }: { initialQuery: string }) {
  const { scrollRef } = useScrollContainer();
  const [query, setQuery] = useState(initialQuery);
  const [resultsState, setResultsState] = useState<{
    forQuery: string;
    payload: SearchPayload;
  }>({ forQuery: '', payload: EMPTY });
  const play = usePlayerStore((s) => s.actions.play);

  const debounced = useDebounce(query, 240);
  const trimmedQuery = debounced.trim();

  useEffect(() => {
    if (!trimmedQuery) return;
    const ctrl = new AbortController();
    fetch(`/api/search?q=${encodeURIComponent(trimmedQuery)}`, {
      signal: ctrl.signal,
    })
      .then((r) => r.json() as Promise<SearchPayload>)
      .then((payload) => setResultsState({ forQuery: trimmedQuery, payload }))
      .catch((err) => {
        if (err.name !== 'AbortError') console.warn('Search failed', err);
      });
    return () => ctrl.abort();
  }, [trimmedQuery]);

  const visibleResults: SearchPayload = trimmedQuery
    ? resultsState.payload
    : EMPTY;

  const resultsAreFresh = resultsState.forQuery === trimmedQuery;

  return (
    <>
      <Header
        scrollContainerRef={scrollRef as React.RefObject<HTMLElement | null>}
        accent="#121212"
      />
      <div className={ui.pagePadding}>
        <div className="sticky top-0 z-20 mb-6 -mx-4 bg-bg-base/80 px-4 py-4 backdrop-blur sm:top-[64px] sm:-mx-6 sm:px-6">
          <label className="relative flex w-full max-w-[364px] items-center">
            <SearchIcon
              size={18}
              className="pointer-events-none absolute left-3 text-text-subdued"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="What do you want to play?"
              aria-label="Search"
              className={ui.searchInput}
            />
            {query && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => setQuery('')}
                className="absolute right-3 text-text-subdued hover:text-text-base">
                <X size={16} />
              </button>
            )}
          </label>
        </div>

        {!debounced ? (
          <section>
            <h2 className={ui.sectionHeading}>Browse all</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
              {searchCategories.map((c, i) => (
                <Link
                  key={c.id}
                  href={`/search?q=${encodeURIComponent(c.name)}`}
                  className="relative aspect-[16/11] overflow-hidden rounded-lg p-4 transition hover:opacity-95"
                  style={{ backgroundColor: c.color }}>
                  <span className="relative z-10 text-xl font-bold text-white drop-shadow">
                    {c.name}
                  </span>
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -bottom-2 -right-2 h-24 w-24 rotate-[25deg] overflow-hidden rounded-md shadow-xl">
                    <Image
                      src={c.imageUrl}
                      alt=""
                      fill
                      sizes="96px"
                      priority={i < 5}
                      className="object-cover"
                    />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ) : (
          <div className="space-y-8">
            {visibleResults.topResult && (
              <section className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,380px)_1fr]">
                <div>
                  <h2 className={ui.sectionHeading}>Top Results</h2>
                  <Link
                    href={visibleResults.topResult.href}
                    className={cn(
                      ui.contentCard,
                      'group relative block rounded-lg p-5',
                    )}>
                    <div
                      className={`relative h-24 w-24 overflow-hidden bg-decorative-subdued ${visibleResults.topResult.kind === 'artist' ? 'rounded-full' : 'rounded-md'}`}>
                      <Image
                        src={visibleResults.topResult.imageUrl}
                        alt=""
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    </div>
                    <p className="mt-4 truncate text-3xl font-black text-text-base">
                      {visibleResults.topResult.title}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs font-bold uppercase text-text-base">
                        {visibleResults.topResult.kind}
                      </span>
                      <span className="text-sm text-text-subdued">
                        {visibleResults.topResult.subtitle}
                      </span>
                    </div>
                    <button
                      type="button"
                      aria-label="Play top result"
                      onClick={(e) => {
                        e.preventDefault();
                        const top = visibleResults.topResult;
                        if (!top) return;
                        if (top.kind === 'track') {
                          const t = visibleResults.tracks.find(
                            (x) => x.id === top.id,
                          );
                          if (t) play(t, visibleResults.tracks);
                        } else if (top.kind === 'artist') {
                          const a = visibleResults.artists.find(
                            (x) => x.id === top.id,
                          );
                          if (a?.popularTracks[0])
                            play(a.popularTracks[0], a.popularTracks);
                        } else if (top.kind === 'album') {
                          const al = visibleResults.albums.find(
                            (x) => x.id === top.id,
                          );
                          if (al?.tracks[0]) play(al.tracks[0], al.tracks);
                        } else if (top.kind === 'playlist') {
                          const pl = visibleResults.playlists.find(
                            (x) => x.id === top.id,
                          );
                          if (pl?.tracks[0]) play(pl.tracks[0], pl.tracks);
                        }
                      }}
                      className=" absolute bottom-5 right-5 flex h-12 w-12 translate-y-2 items-center justify-center rounded-full bg-pulse-accent text-black opacity-0 shadow-lg transition-all duration-200 hover:scale-105 group-hover:translate-y-0 group-hover:opacity-100">
                      <Play
                        size={20}
                        className="translate-x-[1px] fill-black"
                      />
                    </button>
                  </Link>
                </div>

                {visibleResults.tracks.length > 0 && (
                  <div className="min-w-0">
                    <h2 className={ui.sectionHeading}>Songs</h2>
                    <div className="flex flex-col">
                      {visibleResults.tracks.slice(0, 4).map((t, i) => (
                        <TrackRow
                          key={t.id}
                          index={i}
                          track={t}
                          queue={visibleResults.tracks}
                          showAlbum={false}
                          showDateAdded={false}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </section>
            )}

            {visibleResults.artists.length > 0 && (
              <section>
                <h2 className={ui.sectionHeading}>Artists</h2>
                <div className={ui.cardGrid}>
                  {visibleResults.artists.map((a) => (
                    <ContentCard
                      key={a.id}
                      imageUrl={a.imageUrl}
                      title={a.name}
                      subtitle="Artist"
                      href={`/artist/${a.id}`}
                      variant="artist"
                    />
                  ))}
                </div>
              </section>
            )}

            {visibleResults.albums.length > 0 && (
              <section>
                <h2 className={ui.sectionHeading}>Albums</h2>
                <div className={ui.cardGrid}>
                  {visibleResults.albums.map((al) => (
                    <ContentCard
                      key={al.id}
                      imageUrl={al.coverUrl}
                      title={al.title}
                      subtitle={`${al.year} · ${al.artist}`}
                      href={`/album/${al.id}`}
                      variant="album"
                      onPlay={() =>
                        al.tracks[0] && play(al.tracks[0], al.tracks)
                      }
                    />
                  ))}
                </div>
              </section>
            )}

            {visibleResults.playlists.length > 0 && (
              <section>
                <h2 className={ui.sectionHeading}>Playlists</h2>
                <div className={ui.cardGrid}>
                  {visibleResults.playlists.map((p) => (
                    <ContentCard
                      key={p.id}
                      imageUrl={p.coverUrl}
                      title={p.title}
                      subtitle={`By ${p.owner}`}
                      href={`/playlist/${p.id}`}
                      onPlay={() => p.tracks[0] && play(p.tracks[0], p.tracks)}
                    />
                  ))}
                </div>
              </section>
            )}

            {resultsAreFresh && visibleResults.topResult === null && (
              <div className="py-16 text-center">
                <p className="text-2xl font-bold text-text-base">
                  No results found for "{debounced}"
                </p>
                <p className="mt-2 text-sm text-text-subdued">
                  Please make sure your words are apelled correctly, or use
                  fewer or different keywords.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
