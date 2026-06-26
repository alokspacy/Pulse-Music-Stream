import { create } from 'zustand';

export type LibraryFilter = 'playlists' | 'albums' | 'artists' | 'all';

export interface LibraryRow {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string | null;
  href: string;
  kind: 'playlist' | 'album' | 'artist' | 'liked';
  ownedByMe?: boolean;
}

interface LibraryState {
  likedTrackIds: string[];
  followedArtistIds: string[];
  savedAlbumIds: string[];
  savedPlaylistIds: string[];
  rows: LibraryRow[];
  likedCount: number;
  filter: LibraryFilter;
  sidebarCollapsed: boolean;
  mobileNavOpen: boolean;

  toggleLikeTrack: (id: string) => void;
  toggleFollowArtist: (id: string) => void;
  toggleSaveAlbum: (id: string) => void;
  toggleSavePlaylist: (id: string) => void;
  setFilter: (f: LibraryFilter) => void;
  setSidebarCollapsed: (v: boolean) => void;
  setMobileNavOpen: (v: boolean) => void;

  /** Replace the entire snapshot at once. Called by LibraryHydrator */
  hydrate: (snapshot: {
    likedTrackIds: string[];
    savedAlbumIds: string[];
    followedArtistIds: string[];
    rows: LibraryRow[];
    likedCount: number;
  }) => void;
}

function toggle(arr: string[], id: string): string[] {
  return arr.includes(id) ? arr.filter((x) => x !== id) : [id, ...arr];
}

export const useLibraryStore = create<LibraryState>()((set) => ({
  likedTrackIds: [],
  followedArtistIds: [],
  savedAlbumIds: [],
  savedPlaylistIds: [],
  rows: [],
  likedCount: 0,
  filter: 'all',
  sidebarCollapsed: false,
  mobileNavOpen: false,

  toggleLikeTrack: (id) =>
    set((s) => ({ likedTrackIds: toggle(s.likedTrackIds, id) })),

  toggleFollowArtist: (id) =>
    set((s) => ({ followedArtistIds: toggle(s.followedArtistIds, id) })),

  toggleSaveAlbum: (id) =>
    set((s) => ({ savedAlbumIds: toggle(s.savedAlbumIds, id) })),

  toggleSavePlaylist: (id) =>
    set((s) => ({ savedPlaylistIds: toggle(s.savedPlaylistIds, id) })),

  setFilter: (filter) => set({ filter }),

  setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),

  setMobileNavOpen: (mobileNavOpen) => set({ mobileNavOpen }),

  hydrate: (snapshot) =>
    set({
      likedTrackIds: snapshot.likedTrackIds,
      savedAlbumIds: snapshot.savedAlbumIds,
      followedArtistIds: snapshot.followedArtistIds,
      rows: snapshot.rows,
      likedCount: snapshot.likedCount,
    }),
}));
