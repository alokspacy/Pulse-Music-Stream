"use server";

/**
 * Server actions for resolving full track lists when the user plays
 * from a home card (chart summaries may omit tracks).
 */
import { getAlbumDetail, getPlaylistDetail } from "@/lib/catalogues";
import type { Track } from "@/types";

export async function getPlayablePlaylistTracks(
  playlistId: string
): Promise<Track[]> {
  const playlist = await getPlaylistDetail(playlistId);
  return playlist?.tracks ?? [];
}

export async function getPlayableAlbumTracks(albumId: string): Promise<Track[]> {
  const album = await getAlbumDetail(albumId);
  return album?.tracks ?? [];
}
