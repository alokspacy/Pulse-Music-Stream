import { AlbumContent } from '@/components/album/AlbumContent';
import { getAlbumDetail } from '@/lib/catalogues';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

type AlbumPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: AlbumPageProps): Promise<Metadata> {
  const { id } = await params;
  const album = await getAlbumDetail(id);
  if (!album) return { title: 'Album not found' };
  const artist = album.artist ? ` . ${album.artist}` : '';
  return {
    title: `${album.title}${artist}`,
    description: album.artist
      ? `Liste to ${album.title} by ${album.artist} on Spotify Clone.`
      : `Liste to ${album.title} on Spotify Clone.`,
  };
}

export default async function AlbumPage({ params }: AlbumPageProps) {
  const { id } = await params;
  const album = await getAlbumDetail(id);
  if (!album) notFound();
  return <AlbumContent album={album} />;
}
