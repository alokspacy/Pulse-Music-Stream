'use client';

import { cn } from '@/lib/utils';

interface PlayingIndicatorProps {
  playing?: boolean;
  className?: string;
}

export function PlayingIndicator({
  playing = true,
  className,
}: PlayingIndicatorProps) {
  return (
    <div
      aria-hidden
      className={cn('inline-flex h-4 items-end gap-[2px]', className)}>
      <span
        className="equalizer-bar"
        style={{ animationPlayState: playing ? 'running' : 'paused' }}
      />
      <span
        className="equalizer-bar"
        style={{ animationPlayState: playing ? 'running' : 'paused' }}
      />
      <span
        className="equalizer-bar"
        style={{ animationPlayState: playing ? 'running' : 'paused' }}
      />
    </div>
  );
}
