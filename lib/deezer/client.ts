import 'server-only';

import type {
  DeezerAlbumRaw,
  DeezerArtistRaw,
  DeezerEnvelope,
  DeezerPlaylistRaw,
  DeezerTrackRaw,
} from './types';

const DEFAULT_REVALIDATE_S = 60 * 60;
const BASE = 'https://api.deezer.com';

interface FetchOpts {
  revalidate?: number;
}

function emptyEnvelope<T>(): DeezerEnvelope<T> {
  return { data: [], total: 0 };
}

async function fetchDeezer<T>(
  path: string,
  params: Record<string, string | number | undefined> = {},
  opts: FetchOpts = {},
): Promise<T> {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== '') {
      qs.set(k, String(v));
    }
  }

  const url = `${BASE}${path}${qs.toString() ? `?${qs}` : ''}`;
  try {
    const res = await fetch(url, {
      next: { revalidate: opts.revalidate ?? DEFAULT_REVALIDATE_S },
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) {
      return emptyEnvelope<unknown>() as T;
    }

    const json = (await res.json()) as T & { error?: unknown };
    if (json && typeof json === 'object' && 'error' in json && json.error) {
      return emptyEnvelope<unknown>() as T;
    }

    return json;
  } catch {
    return emptyEnvelope<unknown>() as T;
  }
}

// Public API
export const deezer = {
  chartTracks: (limit = 24) =>
    fetchDeezer<DeezerEnvelope<DeezerTrackRaw>>('/chart/0/tracks', { limit }),

  chartAlbums: (limit = 24) =>
    fetchDeezer<DeezerEnvelope<DeezerAlbumRaw>>('/chart/0/albums', { limit }),

  chartArtists: (limit = 24) =>
    fetchDeezer<DeezerEnvelope<DeezerArtistRaw>>('/chart/0/artists', { limit }),

  chartPlaylists: (limit = 24) =>
    fetchDeezer<DeezerEnvelope<DeezerPlaylistRaw>>('/chart/0/playlists', {
      limit,
    }),

  searchTracks: (q: string, limit = 24) =>
    fetchDeezer<DeezerEnvelope<DeezerTrackRaw>>(
      '/search/track',
      { q, limit },
      { revalidate: 60 * 10 },
    ),

  searchAlbums: (q: string, limit = 24) =>
    fetchDeezer<DeezerEnvelope<DeezerAlbumRaw>>(
      '/search/album',
      { q, limit },
      { revalidate: 60 * 10 },
    ),

  searchArtists: (q: string, limit = 24) =>
    fetchDeezer<DeezerEnvelope<DeezerArtistRaw>>(
      '/search/artist',
      { q, limit },
      { revalidate: 60 * 10 },
    ),

  searchPlaylists: (q: string, limit = 24) =>
    fetchDeezer<DeezerEnvelope<DeezerPlaylistRaw>>(
      '/search/playlist',
      { q, limit },
      { revalidate: 60 * 10 },
    ),
  album: (id: number) => fetchDeezer<DeezerAlbumRaw>(`/album/${id}`),

  artist: (id: number) => fetchDeezer<DeezerArtistRaw>(`/artist/${id}`),

  artistTop: (id: number, limit = 10) =>
    fetchDeezer<DeezerEnvelope<DeezerTrackRaw>>(`/artist/${id}/top`, { limit }),

  artistAlbums: (id: number, limit = 10) =>
    fetchDeezer<DeezerEnvelope<DeezerAlbumRaw>>(`/artist/${id}/albums`, {
      limit,
    }),

  artistRelated: (id: number, limit = 6) =>
    fetchDeezer<DeezerEnvelope<DeezerArtistRaw>>(`/artist/${id}/related`, {
      limit,
    }),

  playlist: (id: number) => fetchDeezer<DeezerPlaylistRaw>(`/playlist/${id}`),
};
