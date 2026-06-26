import { SearchContent } from "@/components/search/SearchContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Search',
  description: 'Search Pulse for songs, albums, artists, and playlists'
}

export default function SearchPage() {
  return <SearchContent />
}