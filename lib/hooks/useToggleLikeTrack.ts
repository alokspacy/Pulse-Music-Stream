'use client';

import { useLibraryStore } from '@/store/libraryStore';
import { useToastStore } from '@/store/toastStore';
import { useTransition } from 'react';
import { toggleLikeTrack as toggleLikeTrackAction } from '../actions/library';
import type { Track } from '@/types';

export function useToggleLikeTrack(track: Track | null | undefined) {
  const liked = useLibraryStore((s) =>
    track ? s.likedTrackIds.includes(track.id) : false,
  );
  const toggleLike = useLibraryStore((s) => s.toggleLikeTrack);
  const pushToast = useToastStore((s) => s.push);
  const [, startTransition] = useTransition();

  const toggle = () => {
    if (!track) return;
    toggleLike(track.id);
    pushToast(liked ? 'Removed from Liked Songs' : 'Added to Liked Songs');

    startTransition(async () => {
      try {
        await toggleLikeTrackAction({
          id: track.id,
          title: track.title,
          artist: track.artist,
          artistId: track.artistId,
          album: track.album,
          albumId: track.albumId,
          duration: track.duration,
          coverUrl: track.coverUrl,
          audioUrl: track.audioUrl,
        });
      } catch {
        toggleLike(track.id);
        pushToast('Log in to save songs');
      }
    });
  };

  return { liked, toggle };
}
