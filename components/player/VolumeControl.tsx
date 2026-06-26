'use client';

import { usePlayerStore } from '@/store/playerStore';
import { Volume, Volume1, Volume2, VolumeX } from 'lucide-react';
import { Slider } from '../ui/Slider';
import { IconButton } from '../ui/IconButton';

export function VolumeControl() {
  const volume = usePlayerStore((s) => s.volume);
  const setVolume = usePlayerStore((s) => s.actions.setVolume);
  const toggleMute = usePlayerStore((s) => s.actions.toggleMute);

  const Icon =
    volume === 0
      ? VolumeX
      : volume < 0.33
        ? Volume
        : volume < 0.66
          ? Volume1
          : Volume2;

  return (
    <div className="flex w-24 items-center gap-2 lg:w-32">
      <IconButton
        label={volume === 0 ? 'Unmute' : 'Mute'}
        size="sm"
        onClick={toggleMute}>
        <Icon size={18} />
      </IconButton>
      <Slider
        value={volume * 100}
        onChange={(v) => setVolume(v / 100)}
        ariaLabel="Volume"
        className="flex-1"
      />
    </div>
  );
}
