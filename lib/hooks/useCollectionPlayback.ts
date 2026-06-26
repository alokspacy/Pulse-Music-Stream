'use client';

import { usePlayerStore } from '@/store/playerStore';
import type { Track } from '@/types';

export function useCollectionPlayback(tracks: Track[]) {
  const currentTrack = usePlayerStore((s) => s.currentTrack);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const { play, togglePlay } = usePlayerStore((s) => s.actions);

  const isInCollection = Boolean(
    currentTrack && tracks.some((t) => t.id === currentTrack.id),
  );

  const isPlayingThis = isInCollection && isPlaying;

  const onHeaderPlay = () => {
    if (isInCollection) {
      togglePlay();
    } else if (tracks[0]) {
      play(tracks[0], tracks);
    }
  };

  return { isInCollection, isPlayingThis, onHeaderPlay };
}
