'use client';

import { Search as SearchIcon, Plus } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { Header } from '../layout/Header';
import { LibraryFilterBar } from './LibraryFilterBar';
import { LibraryRow } from './LibraryRow';
import { useScrollContainer } from '../layout/scroll-context';
import { useLibraryStore } from '@/store/libraryStore';
import { useToastStore } from '@/store/toastStore';
import { ui } from '@/lib/styles';
import { createPlaylist } from '@/lib/actions/playlists';

export function LibraryContent() {
  const { scrollRef } = useScrollContainer();
  const router = useRouter();
  const { data: session } = useSession();
  const pushToast = useToastStore((s) => s.push);
  const [pending, startTransition] = useTransition();
  const filter = useLibraryStore((s) => s.filter);
  const setFilter = useLibraryStore((s) => s.setFilter);
  const rows = useLibraryStore((s) => s.rows);
  const [query, setQuery] = useState('');

  const filtered = rows.filter((r) => {
    if (filter !== 'all') {
      if (filter === 'playlists' && r.kind !== 'playlist' && r.kind !== 'liked')
        return false;
      if (filter === 'albums' && r.kind !== 'album') return false;
      if (filter === 'artists' && r.kind !== 'artist') return false;
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      return (
        r.title.toLowerCase().includes(q) ||
        r.subtitle.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const onCreatePlaylist = () => {
    if (!session?.user) {
      pushToast('Log in to create a playlist');
      router.push('/login');
      return;
    }
    startTransition(async () => {
      try {
        const { id } = await createPlaylist();
        pushToast('Playlist created');
        router.push(`/playlist/${id}`);
        router.refresh();
      } catch (err) {
        pushToast(
          err instanceof Error && err.message === 'unauthorized'
            ? 'Please log in first.'
            : 'Could not create playlist',
        );
      }
    });
  };

  return (
    <>
      <Header
        scrollContainerRef={scrollRef as React.RefObject<HTMLElement | null>}
        accent="#121212"
      />
      <div className={ui.pagePadding}>
        <div className="mb-6 flex items-center justify-between gap-3">
          <h1 className="text-2xl font-black text-text-base sm:text-3xl">
            Your Library
          </h1>
          <button
            type="button"
            disabled={pending}
            onClick={onCreatePlaylist}
            className={ui.newPlaylistBtn}>
            <Plus size={16} /> New playlist
          </button>
        </div>

        <LibraryFilterBar
          filter={filter}
          onFilterChange={setFilter}
          className="mb-4"
          trailing={
            <label className="relative order-last w-full sm:order-0 sm:ml-auto sm:w-auto">
              <SearchIcon
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-subdued"
              />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search in Your Library"
                aria-label="Search in your library"
                className={ui.librarySearchInput}
              />
            </label>
          }
        />

        <ul className="flex flex-col">
          {filtered.map((row) => (
            <li key={`${row.kind}-${row.id}`}>
              <LibraryRow row={row} />
            </li>
          ))}
          {filtered.length === 0 && (
            <li className="py-12 text-center text-sm text-text-subdued">
              {session?.user
                ? 'Nothing haere yet, Hit "New Playlist" to create one.'
                : 'Log in to see your library.'}
            </li>
          )}
        </ul>
      </div>
    </>
  );
}
