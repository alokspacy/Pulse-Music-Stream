'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { safeAuth } from '../auth';
import { prisma } from '@/lib/prisma';

async function requireuserId(): Promise<string | null> {
  const session = await safeAuth();
  return session?.user?.id ?? null;
}

// Liked tracks
const likeSchema = z.object({
  id: z.string().min(1),
  title: z.string(),
  artist: z.string(),
  artistId: z.string().optional(),
  album: z.string().optional(),
  albumId: z.string().optional(),
  duration: z.number().int().min(0),
  coverUrl: z.string().optional(),
  audioUrl: z.string().optional(),
});

export async function toggleLikeTrack(
  input: unknown,
): Promise<{ liked: boolean }> {
  const userId = await requireuserId();
  if (!userId) throw new Error('Unauthorized');
  const t = likeSchema.parse(input);

  const existing = await prisma.likedTrack.findUnique({
    where: { userId_trackId: { userId, trackId: t.id } },
  });

  if (existing) {
    await prisma.likedTrack.delete({ where: { id: existing.id } });
    revalidatePath('/liked-songs');
    revalidatePath('/library');
    return { liked: false };
  }
  await prisma.likedTrack.create({
    data: {
      userId,
      trackId: t.id,
      title: t.title,
      artist: t.artist,
      artistId: t.artistId,
      album: t.album,
      albumId: t.albumId,
      durationSec: t.duration,
      coverUrl: t.coverUrl,
      audioUrl: t.audioUrl,
    },
  });
  revalidatePath('/liked-songs');
  revalidatePath('/library');
  return { liked: true };
}

export async function listLikedTrackIds(): Promise<string[]> {
  const userId = await requireuserId();
  if (!userId) return [];
  const rows = await prisma.likedTrack.findMany({
    where: { userId },
    select: { trackId: true },
  });
  return rows.map((r) => r.trackId);
}

// Saved albums

const saveAlbumSchema = z.object({
  id: z.string().min(1),
  title: z.string(),
  artist: z.string(),
  artistId: z.string().optional(),
  coverUrl: z.string().optional(),
});

export async function toggleSaveAlbum(
  input: unknown,
): Promise<{ saved: boolean }> {
  const userId = await requireuserId();
  if (!userId) throw new Error('Unauthorized');
  const a = saveAlbumSchema.parse(input);
  const existing = await prisma.savedAlbum.findUnique({
    where: { userId_albumId: { userId, albumId: a.id } },
  });
  if (existing) {
    await prisma.savedAlbum.delete({ where: { id: existing.id } });
    revalidatePath('/library');
    return { saved: false };
  }
  await prisma.savedAlbum.create({
    data: {
      userId,
      albumId: a.id,
      title: a.title,
      artist: a.artist,
      artistId: a.artistId,
      coverUrl: a.coverUrl,
    },
  });
  revalidatePath('/library');
  return { saved: true };
}

// Followed artists
const followSchema = z.object({
  id: z.string().min(1),
  name: z.string(),
  imageUrl: z.string().optional(),
});

export async function toggleFollowArtist(
  input: unknown,
): Promise<{ followed: boolean }> {
  const userId = await requireuserId();
  if (!userId) throw new Error('Unauthorized');
  const a = followSchema.parse(input);
  const existing = await prisma.followedArtist.findUnique({
    where: { userId_artistId: { userId, artistId: a.id } },
  });
  if (existing) {
    await prisma.followedArtist.delete({ where: { id: existing.id } });
    revalidatePath('/library');
    return { followed: false };
  }
  await prisma.followedArtist.create({
    data: {
      userId,
      artistId: a.id,
      name: a.name,
      imageUrl: a.imageUrl,
    },
  });
  revalidatePath('/library');
  return { followed: true };
}

// Bulk read for hydration
export interface LibraryRow {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string | null;
  href: string;
  kind: 'playlist' | 'album' | 'artist' | 'liked';
  ownedByMe?: boolean;
}

export interface LibrarySnapshot {
  likedTrackIds: string[];
  savedAlbumIds: string[];
  followedArtistIds: string[];
  likedCount: number;
  rows: LibraryRow[];
}

const EMPTY_SNAPSHOT: LibrarySnapshot = {
  likedTrackIds: [],
  savedAlbumIds: [],
  followedArtistIds: [],
  likedCount: 0,
  rows: [],
};

export async function loadLibrarySnapshot(): Promise<LibrarySnapshot> {
  const userId = await requireuserId();
  if (!userId) return EMPTY_SNAPSHOT;

  const [likes, albums, artists, playlists, likedCount] = await Promise.all([
    prisma.likedTrack.findMany({
      where: { userId },
      select: { trackId: true },
    }),
    prisma.savedAlbum.findMany({
      where: { userId },
      orderBy: { savedAt: 'desc' },
    }),
    prisma.followedArtist.findMany({
      where: { userId },
      orderBy: { followedAt: 'desc' },
    }),
    prisma.playlist.findMany({
      where: { ownerId: userId },
      orderBy: { updatedAt: 'desc' },
      include: {
        _count: { select: { tracks: true } },
        tracks: {
          orderBy: { position: 'asc' },
          take: 1,
          select: { coverurl: true },
        },
      },
    }),
    prisma.likedTrack.count({ where: { userId } }),
  ]);

  const rows: LibraryRow[] = [
    {
      id: 'liked',
      title: 'Liked Songs',
      subtitle: `Playlist · ${likedCount} ${likedCount === 1 ? 'song' : 'songs'}`,
      imageUrl: null,
      href: '/liked-songs',
      kind: 'liked',
    },
    ...playlists.map<LibraryRow>((p) => ({
      id: p.id,
      title: p.name,
      subtitle: `Playlist · you${
        p._count.tracks ? ` · ${p._count.tracks} songs` : ''
      }`,
      imageUrl: p.coverUrl ?? p.tracks[0]?.coverurl ?? null,
      href: `/playlist/${p.id}`,
      kind: 'playlist',
      ownedByMe: true,
    })),
    ...albums.map<LibraryRow>((a) => ({
      id: a.albumId,
      title: a.title,
      subtitle: `Album · ${a.artist}`,
      imageUrl: a.coverUrl ?? null,
      href: `/album/${a.albumId}`,
      kind: 'album',
    })),
    ...artists.map<LibraryRow>((a) => ({
      id: a.artistId,
      title: a.name,
      subtitle: 'Artist',
      imageUrl: a.imageUrl ?? null,
      href: `/artist/${a.artistId}`,
      kind: 'artist',
    })),
  ];

  return {
    likedTrackIds: likes.map((l) => l.trackId),
    savedAlbumIds: albums.map((a) => a.albumId),
    followedArtistIds: artists.map((a) => a.artistId),
    likedCount,
    rows,
  };
}
