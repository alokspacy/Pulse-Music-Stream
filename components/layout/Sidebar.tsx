'use client';

import { cn } from '@/lib/utils';
import { ArrowRight, Home, Library, LogOut, Plus, Search } from 'lucide-react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useTransition } from 'react';
import { IconButton } from '../ui/IconButton';
import { Tooltip } from '../ui/Tooltip';
import { ui } from '@/lib/styles';
import { useLibraryStore } from '@/store/libraryStore';
import { useIsTablet } from '@/lib/hooks/useMediaQuery';
import { LibraryFilterBar } from '../library/LibraryFilterBar';
import { Avatar } from '../ui/Avatar';
import { useToastStore } from '@/store/toastStore';
import { signOut, useSession } from 'next-auth/react';
import { LibraryRow } from '../library/LibraryRow';
import { LibraryRowCover } from '../library/LibraryRowCover';
import { createPlaylist } from '@/lib/actions/playlists';

interface SidebarProp {
  forceCollapsedOn?: 'md';
  alwaysExpanded?: boolean;
  onNavigate?: () => void;
}

export function Sidebar({
  forceCollapsedOn,
  alwaysExpanded,
  onNavigate,
}: SidebarProp = {}) {
  const router = useRouter();
  const pathname = usePathname();
  const isTablet = useIsTablet();
  const [pending, startTransition] = useTransition();
  const { data: session } = useSession();

  const storedCollapsed = useLibraryStore((s) => s.sidebarCollapsed);
  const setCollapsed = useLibraryStore((s) => s.setSidebarCollapsed);
  const filter = useLibraryStore((s) => s.filter);
  const setFilter = useLibraryStore((s) => s.setFilter);
  const rows = useLibraryStore((s) => s.rows);
  const pushToast = useToastStore((s) => s.push);

  const forcedCollapsed =
    !alwaysExpanded && forceCollapsedOn === 'md' && isTablet;
  const collapsed = alwaysExpanded ? false : forcedCollapsed || storedCollapsed;
  const canToggleCollapse = !alwaysExpanded && !forcedCollapsed;

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  const filteredRows = rows.filter((r) => {
    if (filter === 'all') return true;
    if (filter === 'playlists')
      return r.kind === 'playlist' || r.kind === 'liked';
    if (filter === 'albums') return r.kind === 'album';
    if (filter === 'artists') return r.kind === 'artist';
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
    <aside
      className={cn(
        'flex h-full min-h-0 flex-col gap-2 transition-[width] duration-300',
        collapsed ? 'w-[72px]' : 'w-full sm:w-[340px]',
      )}>
      <nav className="rounded-lg bg-bg-elevated-base p-2">
        <ul className="flex flex-col gap-1">
          <li>
            <Link
              href="/"
              onClick={onNavigate}
              className={cn(
                'flex items-center gap-4 rounded-md px-3 py-2 text-sm font-bold transition',
                isActive('/')
                  ? 'text-text-base'
                  : 'text-text-subdued hover:text-text-base',
                collapsed && 'justify-center px-0',
              )}>
              <Home size={24} className={isActive('/') ? 'fill-current' : ''} />
              {!collapsed && <span>Home</span>}
            </Link>
          </li>
          <li>
            <Link
              href="/search"
              onClick={onNavigate}
              className={cn(
                'flex items-center gap-4 rounded-md px-3 py-2 text-sm font-bold transition',
                isActive('/search')
                  ? 'text-text-base'
                  : 'text-text-subdued hover:text-text-base',
                collapsed && 'justify-center px-0',
              )}>
              <Search size={24} strokeWidth={isActive('/search') ? 3 : 2.4} />
              {!collapsed && <span>Search</span>}
            </Link>
          </li>
        </ul>
      </nav>
      <div className="flex min-h-0 flex-1 flex-col rounded-lg bg-bg-elevated-base">
        <header
          className={cn(
            'flex items-center justify-between px-4 pb-2 pt-4',
            collapsed && 'px-3',
          )}>
          <button
            type="button"
            onClick={() => canToggleCollapse && setCollapsed(!collapsed)}
            aria-label={
              collapsed ? 'Expand Your Library' : 'Collapse Your Library'
            }
            className={cn(
              'flex items-center gap-3 text-sm font-bold text-text-subdued',
              canToggleCollapse && 'hover:text-text-base',
              !canToggleCollapse && 'cursor-default',
            )}>
            <Library size={24} />
          </button>

          {!collapsed && (
            <div className="flex items-center gap-1">
              <IconButton
                label="Create playlist"
                size="md"
                onClick={onCreatePlaylist}
                disabled={pending}>
                <Plus size={18} />
              </IconButton>
              {canToggleCollapse && (
                <IconButton
                  label="Show more"
                  size="md"
                  onClick={() => setCollapsed(true)}>
                  <ArrowRight size={18} />
                </IconButton>
              )}
            </div>
          )}
        </header>

        {!collapsed && (
          <LibraryFilterBar
            filter={filter}
            onFilterChange={setFilter}
            className="overflow-x-auto no-scollbar px-4 pb-3"
          />
        )}

        <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-2">
          <ul className="flex flex-col">
            {filteredRows.map((row) => (
              <li key={`${row.kind}-${row.id}`}>
                {collapsed ? (
                  <Tooltip label={row.title} side="right">
                    <Link
                      href={row.href}
                      onClick={onNavigate}
                      className={ui.libraryRow}>
                      <LibraryRowCover row={row} />
                    </Link>
                  </Tooltip>
                ) : (
                  <LibraryRow
                    row={row}
                    isActive={pathname === row.href}
                    onNavigate={onNavigate}
                  />
                )}
              </li>
            ))}
            {filteredRows.length === 0 && !collapsed && (
              <li className="px-3 py-6 text-center text-sm text-text-subdued">
                {session?.user
                  ? 'Nothing here yet. Create a playlist to get started'
                  : 'Log in to see your library'}
              </li>
            )}
          </ul>
        </div>

        {alwaysExpanded && (
          <div className="border-t border-white/5 px-4 py-4">
            {session?.user ? (
              <AccountFooter
                user={session.user}
                onLogout={() => void signOut({ callbackUrl: '/' })}
              />
            ) : (
              <>
                <p className="mb-3 text-xs font-medium text-text-subdued">
                  Sign up to build playlists, like songs, and follow artists.
                </p>
                <div className="flex flex-col gap-2">
                  <Link
                    href="/register"
                    className="rounded-full border border-white/15 px-4 py-2 text-center text-sm font-bold text-text-base transition hover:scale-[1.02] hover:border-white/30 hover:bg-white/5"
                    onClick={onNavigate}>
                    Sign up
                  </Link>
                  <Link
                    href="/login"
                    className="rounded-full bg-white px-4 py-2 text-center text-sm font-bold text-black transition hover:scale-[1.02]"
                    onClick={onNavigate}>
                    Log in
                  </Link>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}

function AccountFooter({
  user,
  onLogout,
}: {
  user: { name?: string | null; email?: string | null; image?: string | null };
  onLogout: () => void;
}) {
  const display = user.name ?? user.email ?? 'Account';
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <Avatar
          name={user.name}
          email={user.email}
          image={user.image}
          size={40}
        />
        <div className="min-w-0 flex-1">
          <p className="truncate flex-sm font-semibold text-text-base">
            {display}
          </p>
          <p className="text-xs text-text-subdued">Signed in</p>
        </div>
      </div>
      <button
        type="button"
        onClick={onLogout}
        className="flex items-center justify-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm font-bold text-text-base transition hover:scale-[1.02] hover:border-white/30 hover:bg-white/5">
        <LogOut size={16} /> Log out
      </button>
    </div>
  );
}
