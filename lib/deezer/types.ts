export interface DeezerEnvelope<T> {
  data: T[];
  total?: number;
  next?: string;
  prev?: string;
  error?: { type: string; message: string; code: number },
}

export interface DeezerArtistMini {
  id: number;
  name: string;
  picture?: string;
  picture_small?: string;
  picture_medium?: string;
  picture_big?: string;
  picture_xl: string;
  tracklist?: string;
}

export interface DeezerAlbumMini {
  id: number;
  title: string;
  cover?: string;
  cover_small?: string;
  cover_medium?: string;
  cover_big?: string;
  cover_xl?: string;
  tracklist?: string;
  release_date?: string;
}

export interface DeezerTrackRaw {
  id: string;
  title: string;
  title_short?: string;
  duration: number;
  rank?: number;
  explict_lyrics?: boolean;
  preview: string;
  artist: DeezerArtistMini;
  album: DeezerAlbumMini;
}

// Standalone album payload returned by /album/${id}
export interface DeezerAlbumRaw extends DeezerAlbumMini {
  artist: DeezerArtistMini;
  duration?: number;
  nb_track?: number;
  release_date?: string;
  genres?: { data: Array<{ id: number; name: string }> };
  tracks?: DeezerEnvelope<DeezerTrackRaw>;
}

export interface DeezerArtistRaw extends DeezerArtistMini {
  nb_album?: number;
  nb_fan?: number;
  share?: string;
  tracklist?: string;
}

export interface DeezerPlaylistRaw {
  id: number;
  title: string;
  description?: string;
  duration?: number;
  public?: boolean;
  nb_tracks?: number;
  fans?: number;
  picture?: string;
  picture_small?: string;
  picture_medium?: string;
  picture_big?: string;
  picture_xl?: string;
  checksum?: string;
  cration_date?: string;
  creator?: { id: number; name: string };
  user?: { id: number; name: string; };
  tracks?: DeezerEnvelope<DeezerTrackRaw>
}