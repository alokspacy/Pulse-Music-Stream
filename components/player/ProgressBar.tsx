'use client';

import { formatDuration } from '@/lib/utils';
import { usePlayerStore } from '@/store/playerStore';
import { Slider } from '../ui/Slider';

export function ProgressBar() {
  const progress = usePlayerStore((s) => s.progress);
  const duration = usePlayerStore((s) => s.duration);
  const seek = usePlayerStore((s) => s.actions.seek);
  const elapsed = (progress / 100) * duration;

  return (
    <div className="flex w-full items-center gap-2">
      <span className="w-10 shrink-0 text-right font-mono text-[11px] tabular-nums text-text-subdued">
        {formatDuration(elapsed)}
      </span>
      <Slider
        value={progress}
        onChange={seek}
        ariaLabel="Seek"
        className="flex-1"
      />
      <span className="w-10 shrink-0 font-mono text-[11px] tabular-nums text-text-subdued">
        {formatDuration(duration)}
      </span>
    </div>
  );
}
