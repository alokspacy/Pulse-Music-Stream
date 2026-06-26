'use client';

import { cn } from '@/lib/utils';
import { Pause, Play } from 'lucide-react';

interface PlayButtonProps {
  playing: boolean;
  onClick: (e: React.MouseEvent) => void;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  ariaLabel?: string;
}

const sizes: Record<
  NonNullable<PlayButtonProps['size']>,
  { box: string; icon: number }
> = {
  sm: { box: 'h-8 w-8', icon: 14 },
  md: { box: 'h-10 w-10', icon: 16 },
  lg: { box: 'h-12 w-12', icon: 20 },
  xl: { box: 'h-14 w-14', icon: 24 },
};

export function PlayButton({
  playing,
  onClick,
  size = 'md',
  className,
  ariaLabel,
}: PlayButtonProps) {
  const s = sizes[size];
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick(e);
      }}
      aria-label={ariaLabel ?? (playing ? 'Pause' : 'Play')}
      className={cn(
        'inline-flex items-center justify-center rounded-full bg-pulse-accent text-black shadow-[0_8px_24px_rgba(0,0,0,0.5)] transition hover:scale-[1.06] hover:bg-pulse-accent-bright active:scale-95',
        s.box,
        className,
      )}>
      {playing ? (
        <Pause size={s.icon} className="fill-black" />
      ) : (
        <Play size={s.icon} className="fill-black translate-x-[1px]" />
      )}
    </button>
  );
}
