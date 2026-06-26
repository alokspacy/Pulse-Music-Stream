import { LikedSongsCover } from '@/components/ui/LikedSongsCover';
import { safeAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import type { Metadata } from 'next';
import type { Track } from '@/types';
import { LikedSongsContent } from '@/components/library/LikedSongsContent';

export const metadata: Metadata = {
  title: 'Liked Songs',
  description: "Every track you've hearted, in one place.",
};

export default async function LikedSongsPage() {
  const session = await safeAuth();
  let tracks: Track[] = [];
  let ownerName = 'You';

  if (session?.user?.id) {
    const rows = await prisma.likedTrack.findMany({
      where: { userId: session.user.id },
      orderBy: { likedAt: 'desc' },
    });
    tracks = rows.map((t) => ({
      id: t.trackId,
      title: t.title,
      artist: t.artist,
      artistId: t.artistId ?? '',
      album: t.album ?? '',
      albumId: t.albumId ?? '',
      duration: t.durationSec,
      coverUrl: t.coverUrl ?? '',
      audioUrl: t.audioUrl ?? undefined,
      addedAt: t.likedAt.toISOString(),
    }));
    ownerName = session.user.name ?? session.user.email ?? 'You';
  }

  return <LikedSongsContent tracks={tracks} ownerName={ownerName} />;
}
