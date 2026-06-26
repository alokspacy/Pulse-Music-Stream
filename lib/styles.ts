import type { CSSProperties } from 'react';
import { cn } from './utils';

export const ui = {
  // Typography
  sectionHeading: 'mb-4 text-2xl font-bold text-text-base',
  sectionTitle: 'text-2xl font-bold text-text-base',
  sectionShowAll: 'text-sm font-bold text-text-subdued hover:underline',
  authLabel: 'text-sm font-semibold text-white',
  rowTitle: 'truncate text-sm font-medium text-text-subdued',
  rowSubtitle: 'truncate text-xs text-text-subdued',
  playerTitle: 'truncate text-sm font-medium text-text-base',
  playerArtist: 'truncate text-xs text-text-subdued',
  collectionFooter: 'px-4 pt-10 pb-16 text-xs text-text-subdued sm:px-6',

  // Layout & grids
  // Responsive card grid used by SectionRow, search, and artist pages.
  cardGrid:
    'grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-3 sm:grid-cols-[repeat(auto-fill,minmax(170px,1fr))] sm:gap-4',
  flexCenter: 'flex items-center',
  pagePadding: 'px-4 pb-10 sm:px-6',

  // Cards & surfaces
  // Album / playlist / artist content card shell
  contentCard:
    'group block rounded-md bg-bg-elevated-base p-4 transition-colors hover:bg-bg-elevated-highlight focus-visible:bg-bg-elevated-highlight focus-visible:outline-none',
  quickAccessCard:
    'group relative flex h-16 items-center gap-3 overflow-hidden rounded-md bg-white/5 transition-colors hover:bg-white/15',
  coverPlaceholder: 'bg-decorative-subdued',
  coverShadow: 'shadow-[0_8px_24px_rgba(0,0,0,0.5)]',

  // Library & filters
  // Clickable library row (sidebar + /library page)
  libraryRow:
    'flex items-center gap-3 rounded-md p-2 transition hover:bg-white/10',
  filterChip: 'shrink-0 rounded-full px-3 py-1.5 text-sm transition',
  filterClearBtn:
    'grid h-8 w-8 shrink-0 place-items-center rounded-full bg-bg-elevated-highlight text-text-base',
  librarySearchInput:
    'w-full rounded-full bg-bg-elevated-highlight py-2 pl-9 pr-3 text-sm text-text-base placeholder:text-text-subdued outline-none focus-visible:ring-1 focus-visible:ring-white/60 sm:w-64 sm:rounded sm:py-1.5 sm:pl-8',

  // Auth forms
  authInput:
    'w-full rounded-lg border border-white/10 bg-white/4 py-3 pl-11 text-sm text-white placeholder:text-text-subdued/60 outline-none transition hover:bg-white/6 focus:border-pulse-accent-bright focus:bg-white/6 focus:ring-2 focus:ring-pulse-accent-bright/30',
  authInputIcon:
    'pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-text-subdued transition-colors group-focus-whitin:text-white',
  authPasswordToggle:
    'absolute right-3 top-1/2 -translate-y-1/2 rounded p-1.5 text-text-subdued transition hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40',
  authError:
    'flex items-start gap-2.5 rounded-lg border border-red-500/30 bg-red-500/10 px-3.5 py-2.5 text-sm text-red-200',
  authSubmit:
    'mt-1 inline-flex items-center justify-center gap-2 rounded-full bg-pulse-accent-bright px-6 py-3.5 text-sm font-bold text-black shadow-[0_6px_24px_-8px_rgba(168,85,247,0.5)] transition hover:scale-[1.02] hover:bg-pulse-accent-bright active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100',
  authDividerLine: 'h-px flex-1 bg-white/10',

  // Popover menus
  menuPopover:
    'absolute left-auto top-12 z-50 w-56 overflow-hidden rounded-md border border-white/10 bg-bg-elevated-base p-1 shadow-2xl',
  menuItem:
    'flex w-full items-center gap-3 rounded px-3 py-2 text-left text-sm text-text-base transition hover:bg-white/10',
  menuItemDestructive:
    'flex w-full items-center gap-3 rounded px-3 py-2 text-left text-sm text-red-300 transition hover:bg-white/10 hover:text-red-200',

  // Track rows
  trackRow:
    'group grid items-center gap-2 sm:gap-4 rounded-md px-2 sm:px-4 py-2 text-sm text-text-subdued transition hover:bg-white/10',
  trackMetaLink:
    'truncate text-sm text-text-subdued hover:text-text-base hover:underline',

  // Collection Pages
  emptyState:
    'mx-4 mt-6 rounded-lg border border-dashed border-white/15 p-12 text-center text-sm text-text-subdued sm:mx-6',

  // Player & actions
  heartActive: 'fill-pulse-accent text-pulse-accent',
  newPlaylistBtn:
    'inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-sm font-semibold text-text-base transition hover:bg-white/20 disabled:opacity-60',

  // Search
  searchInput:
    'w-full rounded-full border-0 bg-bg-tinted-base py-3 pl-10 pr-10 text-sm text-text-base placeholder:text-text-subdued ring-0 outline-none focus:bg-bg-tinted-highlight focus-visible:ring-2 focus-visible:ring-white/70',
} as const;

/**
 * Active vs inactive styles for library filter chips
 */
export function filterChipClass(active: boolean): string {
  return active
    ? 'bg-white text-black'
    : 'bg-bg-elevated-highlight text-text-base hover:bg-white/20';
}

/**
 * Rounded shape for cover images based on entity type
 */
export function coverShapeClass(
  shape: 'square' | 'circle' | 'rounded',
): string {
  if (shape === 'circle') return 'rounded-full';
  if (shape === 'rounded') return 'rounded';
  return 'rounded-md';
}

/**
 * Inline gradient background
 */
export function collectionGradientStyle(accent: string): CSSProperties {
  return {
    background: `linear-gradient(180deg, ${accent}99 0%, transparent 280px)`,
  };
}
