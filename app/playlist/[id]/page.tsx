import { getPlaylistDetail } from '@/lib/catalogues';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { Playlist } from '@/types';
import { PlaylistContent } from '@/components/playlist/PlaylistContent';
import { getMyPlaylist } from '@/lib/actions/playlists';

type PlaylistPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: PlaylistPageProps): Promise<Metadata> {
  const { id } = await params;
  const fromCatalogue = await getPlaylistDetail(id);
  if (fromCatalogue) {
    return {
      title: fromCatalogue.title,
      description:
        fromCatalogue.description ||
        `Playlist by ${fromCatalogue.owner} on Pulse.`,
    };
  }

  const mine = await getMyPlaylist(id);
  if (mine) {
    return {
      title: mine.name,
      description: mine.description ?? 'Your playlist on Pulse.',
    };
  }

  return { title: 'Playlist not found' };
}

export default async function PlaylistPage({ params }: PlaylistPageProps) {
  const { id } = await params;
  const fromCatalogue = await getPlaylistDetail(id);
  if (fromCatalogue) {
    return <PlaylistContent playlist={fromCatalogue} />;
  }

  // Fall back to a user-owned playlist
  const mine = await getMyPlaylist(id);
  if (!mine) notFound();
  const playlist: Playlist = {
    id: mine.id,
    title: mine.name,
    description: mine.description ?? '',
    coverUrl: mine.coverUrl ?? mine.tracks[0]?.coverUrl ?? undefined,
    owner: mine.ownerName ?? 'You',
    followers: 0,
    tracks: mine.tracks,
    isPublic: false,
  };
  return <PlaylistContent playlist={playlist} ownedByMe />;
}
