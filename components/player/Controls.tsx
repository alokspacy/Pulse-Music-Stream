'use client';

import { usePlayerStore } from '@/store/playerStore';
import {
  Repeat,
  Repeat1,
  Shuffle,
  SkipBack,
  SkipForward,
} from 'lucide-react';
import { IconButton } from '../ui/IconButton';
import { PlayButton } from './PlayButton';

export function Controls() {
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const isShuffle = usePlayerStore((s) => s.isShuffle);
  const repeatMode = usePlayerStore((s) => s.repeatMode);
  const hasTrack = usePlayerStore((s) => Boolean(s.currentTrack));
  const { togglePlay, next, previous, toggleShuffle, cycleRepeat } =
    usePlayerStore((s) => s.actions);

  return (
    <div className="flex items-center gap-3">
      <IconButton
        label="Enable Shuffle"
        size="sm"
        active={isShuffle}
        onClick={toggleShuffle}
        disabled={!hasTrack}>
        <Shuffle size={16} />
      </IconButton>

      <IconButton
        label="Previous"
        size="sm"
        onClick={previous}
        disabled={!hasTrack}>
        <SkipBack size={18} className="fill-current" />
      </IconButton>

      <PlayButton
        playing={isPlaying}
        onClick={togglePlay}
        size="md"
        ariaLabel={isPlaying ? 'Pause' : 'Play'}
      />

      <IconButton label="Next" size="sm" onClick={next} disabled={!hasTrack}>
        <SkipForward size={18} className="fill-current" />
      </IconButton>

      <IconButton
        label={
          repeatMode === 'track'
            ? 'Disable repeat'
            : repeatMode === 'context'
              ? 'Enable repeat one'
              : 'Enable repeat'
        }
        size="sm"
        active={repeatMode !== 'off'}
        onClick={cycleRepeat}
        disabled={!hasTrack}>
        {repeatMode === 'track' ? <Repeat1 size={16} /> : <Repeat size={16} />}
      </IconButton>
    </div>
  );
}
