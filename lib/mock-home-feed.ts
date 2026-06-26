import type { HomeFeed } from "@/lib/catalogues";
import type { Album, AlbumType, Artist, Playlist, Track } from "@/types";

const img = (seed: string) => `https://picsum.photos/seed/${seed}/600/600`;

const AUDIO = [
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
] as const;

// ─── Builders (mirror deezer/mappers.ts) ───────────────────────────────

function mockTrack(input: {
  id: string;
  title: string;
  artist: string;
  artistId: string;
  album: string;
  albumId: string;
  duration: number;
  coverSeed: string;
  audioIndex: number;
}): Track {
  return {
    id: input.id,
    title: input.title,
    artist: input.artist,
    artistId: input.artistId,
    album: input.album,
    albumId: input.albumId,
    duration: input.duration,
    coverUrl: img(input.coverSeed),
    audioUrl: AUDIO[input.audioIndex % AUDIO.length],
  };
}

function mockAlbum(input: {
  id: string;
  title: string;
  artistId: string;
  artist: string;
  coverSeed: string;
  year: number;
  type?: AlbumType;
  tracks: Track[];
}): Album {
  return {
    id: input.id,
    title: input.title,
    artistId: input.artistId,
    artist: input.artist,
    coverUrl: img(input.coverSeed),
    year: input.year,
    type: input.type ?? "album",
    tracks: input.tracks,
  };
}

function mockArtist(input: {
  id: string;
  name: string;
  imageSeed: string;
  monthlyListeners: number;
  genres?: string[];
  popularTracks: Track[];
  albums: Album[];
  bannerSeed?: string;
  bio?: string;
}): Artist {
  return {
    id: input.id,
    name: input.name,
    imageUrl: img(input.imageSeed),
    bannerUrl: input.bannerSeed ? img(input.bannerSeed) : undefined,
    monthlyListeners: input.monthlyListeners,
    verified: input.monthlyListeners > 100_000 ? 'true' : 'false',
    genres: input.genres ?? [],
    popularTracks: input.popularTracks,
    albums: input.albums,
    bio: input.bio,
  } as unknown as Artist;
}

function mockPlaylist(input: {
  id: string;
  title: string;
  description: string;
  coverSeed: string;
  owner?: string;
  followers?: number;
  isPublic?: string;
  tracks: Track[];
}): Playlist {
  return {
    id: input.id,
    title: input.title,
    description: input.description,
    coverUrl: img(input.coverSeed),
    owner: input.owner ?? "Pulse",
    followers: input.followers ?? 0,
    isPublic: input.isPublic ?? "true",
    tracks: input.tracks,
  } as unknown as Playlist;
}

// ─── Catalogue seeds ───────────────────────────────────────────────────

const lavenderTracks = [
  mockTrack({
    id: "tr-nova-1",
    title: "Midnight Static",
    artist: "Nova Ray",
    artistId: "ar-nova",
    album: "Lavender Static",
    albumId: "al-lavender",
    duration: 214,
    coverSeed: "al-lavender",
    audioIndex: 0,
  }),
  mockTrack({
    id: "tr-nova-2",
    title: "Glass Horizon",
    artist: "Nova Ray",
    artistId: "ar-nova",
    album: "Lavender Static",
    albumId: "al-lavender",
    duration: 198,
    coverSeed: "al-lavender",
    audioIndex: 1,
  }),
];

const paperTracks = [
  mockTrack({
    id: "tr-miles-1",
    title: "Paper Crowns",
    artist: "Miles Kline",
    artistId: "ar-miles",
    album: "Paper Crowns",
    albumId: "al-paper",
    duration: 241,
    coverSeed: "al-paper",
    audioIndex: 2,
  }),
];

const crystalTracks = [
  mockTrack({
    id: "tr-elara-1",
    title: "Crystalline",
    artist: "Elara Voss",
    artistId: "ar-elara",
    album: "Crystalline",
    albumId: "al-crystal",
    duration: 203,
    coverSeed: "al-crystal",
    audioIndex: 3,
  }),
];

const acresTracks = [
  mockTrack({
    id: "tr-coast-1",
    title: "Acres of Sky",
    artist: "The Coastals",
    artistId: "ar-coast",
    album: "Acres of Sky",
    albumId: "al-acres",
    duration: 256,
    coverSeed: "al-acres",
    audioIndex: 4,
  }),
];

const neonTracks = [
  mockTrack({
    id: "tr-pulse-1",
    title: "Neon Drive",
    artist: "DJ Pulse",
    artistId: "ar-pulse",
    album: "Neon Drive",
    albumId: "al-neon",
    duration: 189,
    coverSeed: "al-neon",
    audioIndex: 5,
  }),
];

const velvetTracks = [
  mockTrack({
    id: "tr-luna-1",
    title: "Velvet Room",
    artist: "Luna Park",
    artistId: "ar-luna",
    album: "Velvet Room",
    albumId: "al-velvet",
    duration: 227,
    coverSeed: "al-velvet",
    audioIndex: 0,
  }),
];

const lavenderStatic = mockAlbum({
  id: "al-lavender",
  title: "Lavender Static",
  artistId: "ar-nova",
  artist: "Nova Ray",
  coverSeed: "al-lavender",
  year: 2024,
  tracks: lavenderTracks,
});

const paperCrowns = mockAlbum({
  id: "al-paper",
  title: "Paper Crowns",
  artistId: "ar-miles",
  artist: "Miles Kline",
  coverSeed: "al-paper",
  year: 2023,
  tracks: paperTracks,
});

const crystalline = mockAlbum({
  id: "al-crystal",
  title: "Crystalline",
  artistId: "ar-elara",
  artist: "Elara Voss",
  coverSeed: "al-crystal",
  year: 2025,
  tracks: crystalTracks,
});

const acresOfSky = mockAlbum({
  id: "al-acres",
  title: "Acres of Sky",
  artistId: "ar-coast",
  artist: "The Coastals",
  coverSeed: "al-acres",
  year: 2022,
  tracks: acresTracks,
});

const neonDrive = mockAlbum({
  id: "al-neon",
  title: "Neon Drive",
  artistId: "ar-pulse",
  artist: "DJ Pulse",
  coverSeed: "al-neon",
  year: 2024,
  tracks: neonTracks,
});

const velvetRoom = mockAlbum({
  id: "al-velvet",
  title: "Velvet Room",
  artistId: "ar-luna",
  artist: "Luna Park",
  coverSeed: "al-velvet",
  year: 2025,
  tracks: velvetTracks,
});

const popularAlbums: Album[] = [
  lavenderStatic,
  paperCrowns,
  crystalline,
  acresOfSky,
  neonDrive,
  velvetRoom,
];

const novaRay = mockArtist({
  id: "ar-nova",
  name: "Nova Ray",
  imageSeed: "artist-nova",
  bannerSeed: "banner-nova",
  monthlyListeners: 4_820_000,
  genres: ["Pop", "Electronic"],
  popularTracks: lavenderTracks,
  albums: [lavenderStatic],
});

const milesKline = mockArtist({
  id: "ar-miles",
  name: "Miles Kline",
  imageSeed: "artist-miles",
  monthlyListeners: 140_000,
  genres: ["Indie", "Rock"],
  popularTracks: paperTracks,
  albums: [paperCrowns],
});

const elaraVoss = mockArtist({
  id: "ar-elara",
  name: "Elara Voss",
  imageSeed: "artist-elara",
  bannerSeed: "banner-elara",
  monthlyListeners: 8_930_000,
  genres: ["R&B", "Soul"],
  popularTracks: crystalTracks,
  albums: [crystalline],
});

const theCoastals = mockArtist({
  id: "ar-coast",
  name: "The Coastals",
  imageSeed: "artist-coast",
  monthlyListeners: 56_000,
  genres: ["Folk", "Acoustic"],
  popularTracks: acresTracks,
  albums: [acresOfSky],
});

const djPulse = mockArtist({
  id: "ar-pulse",
  name: "DJ Pulse",
  imageSeed: "artist-pulse",
  bannerSeed: "banner-pulse",
  monthlyListeners: 6_710_000,
  genres: ["Dance", "House"],
  popularTracks: neonTracks,
  albums: [neonDrive],
});

const lunaPark = mockArtist({
  id: "ar-luna",
  name: "Luna Park",
  imageSeed: "artist-luna",
  monthlyListeners: 3_280_000,
  genres: ["Dream Pop", "Indie"],
  popularTracks: velvetTracks,
  albums: [velvetRoom],
});

const popularArtists: Artist[] = [
  novaRay,
  elaraVoss,
  djPulse,
  milesKline,
  theCoastals,
  lunaPark,
];

const madeForYou: Playlist[] = [
  mockPlaylist({
    id: "pl-daily-1",
    title: "Daily Mix 1",
    description: "Nova Ray, Elara Voss, DJ Pulse and more",
    coverSeed: "pl-daily-1",
    tracks: [lavenderTracks[0]!, crystalTracks[0]!, neonTracks[0]!, velvetTracks[0]!],
  }),
  mockPlaylist({
    id: "pl-discover",
    title: "Discover Weekly",
    description: "Your weekly mixtape of fresh music",
    coverSeed: "pl-discover",
    tracks: [paperTracks[0]!, acresTracks[0]!, lavenderTracks[1]!],
  }),
  mockPlaylist({
    id: "pl-release",
    title: "Release Radar",
    description: "Catch all the latest music from artists you follow",
    coverSeed: "pl-release",
    tracks: [crystalTracks[0]!, velvetTracks[0]!, neonTracks[0]!],
  }),
  mockPlaylist({
    id: "pl-chill",
    title: "Chill Hits",
    description: "Kick back to the best new and recent chill hits",
    coverSeed: "pl-chill",
    tracks: [acresTracks[0]!, velvetTracks[0]!, paperTracks[0]!],
  }),
];

/** Complete mock feed — use in `app/page.tsx` until Lesson 7 (Deezer). */
export const mockHomeFeed = {
  quickAccess: [
    { id: "liked", title: "Liked Songs", coverUrl: "liked", href: "/liked-songs" },
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
  ],
  madeForYou,
  popularAlbums,
  newReleases: popularAlbums.slice(2, 6),
  popularArtists,
} as HomeFeed;
