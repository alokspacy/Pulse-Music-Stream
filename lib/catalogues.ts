import type { Album, Artist, Playlist, Track } from '@/types';
import { deezer } from './deezer/client';
import {
  DeezerEnvelope,
  DeezerAlbumRaw,
  DeezerArtistRaw,
  DeezerPlaylistRaw,
  DeezerTrackRaw,
} from './deezer/types';
import {
  albumFromDeezer,
  artistFromDeezer,
  playlistFromDeezer,
  trackFromDeezer,
  unwrapDeezerId,
} from './deezer/mappers';

const EMPTY_DEEZER = <T>(): DeezerEnvelope<T> => ({ data: [], total: 0 });

const LIKED_QUICK_ACCESS = {
  id: 'liked',
  title: 'Liked Songs',
  coverUrl: 'liked',
  href: '/liked-songs',
} as const;

async function safe<T>(p: Promise<T>, fallback: T, label: string): Promise<T> {
  try {
    return await p;
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`[catalogue] ${label} failed:`, err);
    }
    return fallback;
  }
}

const EMPTY_HOME_FEED: HomeFeed = {
  quickAccess: [LIKED_QUICK_ACCESS],
  madeForYou: [],
  popularAlbums: [],
  newReleases: [],
  popularArtists: [],
};

// Home fieds
export interface QuickAccessItem {
  id: string;
  title: string;
  coverUrl: string;
  href: string;
}

export interface HomeFeed {
  quickAccess: QuickAccessItem[];
  madeForYou: Playlist[];
  popularAlbums: Album[];
  newReleases: Album[];
  popularArtists: Artist[];
}

export async function getHomeFeed(): Promise<HomeFeed> {
  const [tracksRes, albumsRes, artistsRes, playlistsRes] = await Promise.all([
    safe(deezer.chartTracks(20), EMPTY_DEEZER<DeezerTrackRaw>(), 'chartTracks'),
    safe(deezer.chartAlbums(12), EMPTY_DEEZER<DeezerAlbumRaw>(), 'chartAlbums'),
    safe(
      deezer.chartArtists(12),
      EMPTY_DEEZER<DeezerArtistRaw>(),
      'chartArtists',
    ),
    safe(
      deezer.chartPlaylists(8),
      EMPTY_DEEZER<DeezerPlaylistRaw>(),
      'chartPlaylists',
    ),
  ]);

  if (
    tracksRes.data.length === 0 &&
    albumsRes.data.length === 0 &&
    playlistsRes.data.length === 0
  ) {
    return EMPTY_HOME_FEED;
  }

  const madeForYou: Playlist[] = playlistsRes.data.map(playlistFromDeezer);
  const popularAlbums: Album[] = albumsRes.data.map(albumFromDeezer);
  const newReleases: Album[] = [...albumsRes.data]
    .reverse()
    .map(albumFromDeezer);
  const popularArtists: Artist[] = artistsRes.data.map((a) =>
    artistFromDeezer(a),
  );

  const quickAccess: QuickAccessItem[] = [
    LIKED_QUICK_ACCESS,
    ...madeForYou.slice(0, 3).map((p) => ({
      id: p.id,
      title: p.title,
      coverUrl: p.coverUrl,
      href: `/playlist/${p.id}`,
    })),
    ...popularAlbums.slice(0, 2).map((a) => ({
      id: a.id,
      title: a.title,
      coverUrl: a.coverUrl,
      href: `/album/${a.id}`,
    })),
  ];

  return {
    quickAccess,
    madeForYou,
    popularAlbums,
    newReleases,
    popularArtists,
  };
}

export async function getAlbumDetail(id: string): Promise<Album | null> {
  const deezerId = unwrapDeezerId(id, 'al');
  if (deezerId === null) return null;
  const res = await safe(
    deezer.album(deezerId),
    null as DeezerAlbumRaw | null,
    'deezer.album',
  );
  return res ? albumFromDeezer(res) : null;
}

export async function getArtistDetail(id: string): Promise<Artist | null> {
  const deezerId = unwrapDeezerId(id, 'ar');
  if (deezerId === null) return null;

  const [artistRes, topRes, albumsRes] = await Promise.all([
    safe(
      deezer.artist(deezerId),
      null as DeezerArtistRaw | null,
      'deezer.artist',
    ),
    safe(
      deezer.artistTop(deezerId),
      EMPTY_DEEZER<DeezerTrackRaw>(),
      'deezer.aritstTop',
    ),
    safe(
      deezer.artistAlbums(deezerId),
      EMPTY_DEEZER<DeezerAlbumRaw>(),
      'deezer.aritstAlbums',
    ),
  ]);

  if (!artistRes) return null;

  return artistFromDeezer(artistRes, {
    popularTracks: topRes.data.map(trackFromDeezer),
    albums: albumsRes.data.map(albumFromDeezer),
  });
}

export async function getPlaylistDetail(id: string): Promise<Playlist | null> {
  const deezerId = unwrapDeezerId(id, 'pl');
  if (deezerId === null) return null;

  const res = await safe(
    deezer.playlist(deezerId),
    null as DeezerPlaylistRaw | null,
    'deezer.playlist',
  );

  return res ? playlistFromDeezer(res) : null;
}

// Search
export interface SearchPayload {
  tracks: Track[];
  artists: Artist[];
  albums: Album[];
  playlists: Playlist[];
  topResult: {
    kind: 'artist' | 'album' | 'playlist' | 'track';
    id: string;
    title: string;
    subtitle: string;
    imageUrl: string;
    href: string;
  } | null;
}

const EMPTY_SEARCH: SearchPayload = {
  tracks: [],
  artists: [],
  albums: [],
  playlists: [],
  topResult: null,
};

export async function searchCatalogue(query: string): Promise<SearchPayload> {
  const q = query.trim();
  if (!q) return EMPTY_SEARCH;

  const [tRes, arRes, alRes, plRes] = await Promise.all([
    safe(
      deezer.searchTracks(q, 12),
      EMPTY_DEEZER<DeezerTrackRaw>(),
      'deezer.searchTracks',
    ),
    safe(
      deezer.searchArtists(q, 8),
      EMPTY_DEEZER<DeezerArtistRaw>(),
      'deezer.searchArtists',
    ),
    safe(
      deezer.searchAlbums(q, 8),
      EMPTY_DEEZER<DeezerAlbumRaw>(),
      'deezer.searchAlbums',
    ),
    safe(
      deezer.searchPlaylists(q, 8),
      EMPTY_DEEZER<DeezerPlaylistRaw>(),
      'deezer.searchPlaylists',
    ),
  ]);

  const tracks = tRes.data.map(trackFromDeezer);
  const artists = arRes.data.map((a) => artistFromDeezer(a));
  const albums = alRes.data.map(albumFromDeezer);
  const playlists = plRes.data.map(playlistFromDeezer);

  if (
    !tracks.length &&
    !artists.length &&
    !albums.length &&
    !playlists.length
  ) {
    return EMPTY_SEARCH;
  }

  return {
    tracks,
    artists,
    albums,
    playlists,
    topResult: pickTop(tracks, artists, albums),
  };
}

function pickTop(
  tracks: Track[],
  artists: Artist[],
  albums: Album[],
): SearchPayload['topResult'] {
  if (artists[0]) {
    return {
      kind: 'artist',
      id: artists[0].id,
      title: artists[0].name,
      subtitle: 'Artist',
      imageUrl: artists[0].imageUrl,
      href: `/artist/${artists[0].id}`,
    };
  }
  if (albums[0]) {
    return {
      kind: 'album',
      id: albums[0].id,
      title: albums[0].title,
      subtitle: `Album . ${albums[0].artist}`,
      imageUrl: albums[0].coverUrl,
      href: `/album/${albums[0].id}`,
    };
  }
  if (tracks[0]) {
    return {
      kind: 'track',
      id: tracks[0].id,
      title: tracks[0].title,
      subtitle: `Song . ${tracks[0].artist}`,
      imageUrl: tracks[0].coverUrl,
      href: `/album/${tracks[0].albumId}`,
    };
  }
  return null;
}
