import { HomeContent } from '@/components/home/HomeContent';
import type { Metadata } from 'next';
import { getHomeFeed } from '@/lib/catalogues';

export const metadata: Metadata = {
  title: 'Home',
  description: 'Discover new music, jump back into your favorites.',
};

export default async function HomePage() {
  const feed = await getHomeFeed();
  return <HomeContent feed={feed} />;
}
