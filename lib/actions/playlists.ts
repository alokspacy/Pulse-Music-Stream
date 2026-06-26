'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { safeAuth } from '../auth';
import { prisma } from '../prisma';
import type { Track } from '@/types';

async function requireUserId(): Promise<string> {
  const session = await safeAuth();
  if (!session?.user?.id) throw new Error('Unauthorized');
  return session.user.id;
}

// Create
const createSchema = z.object({
  name: z.string().trim().min(1).max(120).optional(),
  description: z.string().trim().max(300).optional(),
});

export async function createPlaylist(
  input: { name?: string; description?: string } = {},
): Promise<{ id: string }> {
  const userId = await requireUserId();
  const parsed = createSchema.parse(input);

  const count = await prisma.playlist.count({ where: { ownerId: userId } });
  const playlist = await prisma.playlist.create({
    data: {
      ownerId: userId,
      name:
        parsed.name && parsed.name.length > 0
          ? parsed.name
          : `My Playlist #${count + 1}`,
      description: parsed.description ?? null,
    },
  });
  revalidatePath('/library');
  revalidatePath('/');
  return { id: playlist.id };
}

// Delete
export async function deletePlaylist(playlistId: string): Promise<void> {
  const userId = await requireUserId();
  await prisma.playlist.deleteMany({
    where: { id: playlistId, ownerId: userId },
  });
  revalidatePath('/library');
}

// Rename
const renameSchema = z.object({
  id: z.string().min(1),
  name: z.string().trim().min(1).max(120),
  description: z.string().trim().max(300).optional(),
});

export async function renamePlaylist(input: unknown): Promise<void> {
  const userId = await requireUserId();
  const { id, name, description } = renameSchema.parse(input);
  await prisma.playlist.updateMany({
    where: { id, ownerId: userId },
    data: { name, description: description ?? null },
  });
  revalidatePath(`/playlist/${id}`);
  revalidatePath('/library');
}

// Read
export interface UserPlaylistSummary {
  id: string;
  name: string;
  description: string | null;
  coverUrl: string | null;
  trackCount: number;
  updatedAt: Date;
}

export async function listMyPlaylists(): Promise<UserPlaylistSummary[]> {
  const session = await safeAuth();
  if (!session?.user?.id) return [];
  const rows = await prisma.playlist.findMany({
    where: { ownerId: session.user.id },
    orderBy: { updatedAt: 'desc' },
    include: { _count: { select: { tracks: true } } },
  });

  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    description: r.description,
    coverUrl: r.coverUrl,
    trackCount: r._count.tracks,
    updatedAt: r.updatedAt,
  }));
}

export async function getMyPlaylist(id: string): Promise<{
  id: string;
  name: string;
  description: string | null;
  coverUrl: string | null;
  ownerName: string | null;
  tracks: Track[];
} | null> {
  const session = await safeAuth();
  if (!session?.user?.id) return null;
  const p = await prisma.playlist.findFirst({
    where: { id, ownerId: session.user.id },
    include: {
      tracks: { orderBy: { position: 'asc' } },
      owner: { select: { name: true, email: true } },
    },
  });
  if (!p) return null;
  return {
    id: p.id,
    name: p.name,
    description: p.description,
    coverUrl: p.coverUrl,
    ownerName: p.owner.name ?? p.owner.email,
    tracks: p.tracks.map((t) => ({
      id: t.trackId,
      title: t.title,
      artist: t.artist,
      artistId: t.artistId ?? '',
      album: t.album ?? '',
      albumId: t.albumId ?? '',
      duration: t.durationSec,
      coverUrl: t.coverurl ?? '',
      audioUrl: t.audioUrl ?? undefined,
      addedAt: t.addedAt.toISOString(),
    })),
  };
}

// Track management
const trackInput = z.object({
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

const addInput = z.object({
  playlistId: z.string().min(1),
  track: trackInput,
});

export async function addTrackToPlaylist(input: unknown): Promise<void> {
  const userId = await requireUserId();
  const { playlistId, track } = addInput.parse(input);

  const playlist = await prisma.playlist.findFirst({
    where: { id: playlistId, ownerId: userId },
    select: { id: true },
  });
  if (!playlist) throw new Error('Not found');

  const last = await prisma.playlistTrack.findFirst({
    where: { playlistId },
    orderBy: { position: 'desc' },
    select: { position: true },
  });
  const nextPos = (last?.position ?? -1) + 1;

  await prisma.playlistTrack.upsert({
    where: { playlistId_trackId: { playlistId, trackId: track.id } },
    update: {},
    create: {
      playlistId,
      position: nextPos,
      trackId: track.id,
      title: track.title,
      artist: track.artist,
      artistId: track.artistId,
      album: track.album,
      albumId: track.albumId,
      durationSec: track.duration,
      coverurl: track.coverUrl,
      audioUrl: track.audioUrl,
    },
  });

  revalidatePath(`/playlist/${playlistId}`);
}

export async function removeTrackFromPlaylist(
  playlistId: string,
  trackId: string,
): Promise<void> {
  const userId = await requireUserId();
  const playlist = await prisma.playlist.findFirst({
    where: { id: playlistId, ownerId: userId },
    select: { id: true },
  });
  if (!playlist) throw new Error('Not found');
  await prisma.playlistTrack.deleteMany({
    where: { playlistId, trackId },
  });
  revalidatePath(`/playlist/${playlistId}`);
}
