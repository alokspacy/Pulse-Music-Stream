export interface Track {
  id: string;
  title: string;
  artist: string;
  artistId: string;
  album: string;
  albumId: string;
  duration: number;
  coverUrl: string;
  audioUrl?: string;
  explicit?: boolean;
  addedAt?: string;
}

export type AlbumType = 'album' | 'single' | 'ep';

export interface Album {
  id: string;
  title: string;
  artistId: string;
  artist: string;
  coverUrl: string;
  year: number;
  type: AlbumType;
  tracks: Track[];
}

export interface Artist {
  id: string;
  name: string;
  imageUrl: string;
  bannerUrl?: string;
  monthlyListeners: number;
  verified: boolean;
  genres: string[];
  popularTracks: Track[];
  albums: Album[];
  bio?: string;
}

export interface Playlist {
  id: string;
  title: string;
  description: string;
  coverUrl: string;
  owner: string;
  followers: number;
  tracks: Track[];
  isPublic: boolean;
  gradient?: string;
}

export type RepeatMode = 'off' | 'context' | 'track';

export type LibraryItem = 
  | {kind: 'playlist'; data: Playlist}
  | {kind: 'album'; data: Album}
  | {kind: 'artist'; data: Artist}
  | {kind: 'liked'; data: {id: string; title: string; coverUrl: string; count: number}};

export interface Category {
  id: string;
  name: string;
  color: string;
  imageUrl: string;
}