import type { Track, Album, Artist, Playlist } from '@/types';
import type {
  DeezerAlbumRaw,
  DeezerArtistRaw,
  DeezerPlaylistRaw,
  DeezerTrackRaw,
} from './types';

function pickCover(a: Partial<DeezerAlbumRaw>): string {
  return a.cover_big ?? a.cover_medium ?? a.cover_xl ?? a.cover ?? '';
}

function pickArtistPicture(a: Partial<DeezerArtistRaw>): string {
  return a.picture_big ?? a.picture_medium ?? a.picture_xl ?? a.picture ?? '';
}

function pickPlaylistPicture(p: Partial<DeezerPlaylistRaw>): string {
  return p.picture_big ?? p.picture_medium ?? p.picture_xl ?? p.picture ?? '';
}

export const dId = {
  track: (n: number | string) => `d-tr-${n}`,
  album: (n: number | string) => `d-al-${n}`,
  artist: (n: number | string) => `d-ar-${n}`,
  playlist: (n: number | string) => `d-pl-${n}`,
};

export function unwrapDeezerId(
  id: string,
  kind: 'tr' | 'al' | 'ar' | 'pl',
): number | null {
  const prefix = `d-${kind}-`;
  if (!id.startsWith(prefix)) return null;
  const n = Number(id.slice(prefix.length));
  return Number.isFinite(n) ? n : null;
}

// Track
export function trackFromDeezer(t: DeezerTrackRaw): Track {
  return {
    id: dId.track(t.id),
    title: t.title,
    artist: t.artist.name,
    artistId: dId.artist(t.artist.id),
    album: t.album.title,
    albumId: dId.album(t.album.id),
    duration: t.duration,
    coverUrl: pickCover(t.album),
    audioUrl: t.preview || undefined,
    explicit: t.explict_lyrics ?? false,
  };
}

// Album
export function albumFromDeezer(a: DeezerAlbumRaw): Album {
  const year =
    Number((a.release_date ?? '').slice(0, 4)) || new Date().getFullYear();
  return {
    id: dId.album(a.id),
    title: a.title,
    artist: a.artist?.name ?? '',
    artistId: a.artist ? dId.artist(a.artist.id) : '',
    coverUrl: pickCover(a),
    year,
    type: 'album',
    tracks: (a.tracks?.data ?? []).map((t) =>
      trackFromDeezer({
        ...t,
        album: {
          ...t.album,
          title: a.title,
          cover_big: pickCover(a) || undefined,
        },
      }),
    ),
  };
}

// Artis
export function artistFromDeezer(
  a: DeezerArtistRaw,
  extra: { popularTracks?: Track[]; albums?: Album[] } = {},
): Artist {
  return {
    id: dId.artist(a.id),
    name: a.name,
    imageUrl: pickArtistPicture(a),
    monthlyListeners: a.nb_fan ?? 0,
    verified: (a.nb_fan ?? 0) > 100_0000,
    genres: [],
    popularTracks: extra.popularTracks ?? [],
    albums: extra.albums ?? [],
  };
}

// Playlist
export function playlistFromDeezer(p: DeezerPlaylistRaw): Playlist {
  return {
    id: dId.playlist(p.id),
    title: p.title,
    description: p.description ?? '',
    coverUrl: pickPlaylistPicture(p),
    owner: p.creator?.name ?? p.user?.name ?? 'Deezer',
    followers: p.fans ?? 0,
    isPublic: p.public ?? true,
    tracks: (p.tracks?.data ?? []).map(trackFromDeezer),
  };
}
