import type { LibraryFilter } from "@/store/libraryStore";

export const LIBRARY_FILTERS: {id: LibraryFilter; label: string}[] = [
  { id: 'playlists', label: 'Playlists' },
  { id: 'albums', label: 'Albums' },
  { id: 'artists', label: 'Artists' },
];