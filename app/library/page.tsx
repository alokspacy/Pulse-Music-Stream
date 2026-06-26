import { LibraryContent } from "@/components/library/LibraryContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Your library',
  description: 'Your playlists, liked songs, saved albums, and followed artists.'
}

export default function Librarypage(){
  return <LibraryContent />
}