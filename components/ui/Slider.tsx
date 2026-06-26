'use client';

import { cn } from '@/lib/utils';
import { useRef, type CSSProperties } from 'react';

interface SliderProps {
  value: number; // 0-100
  onChange: (v: number) => void;
  onChangeEnd?: (v: number) => void;
  ariaLabel: string;
  className?: string;
  trackHeight?: number;
}

export function Slider({
  value,
  onChange,
  onChangeEnd,
  ariaLabel,
  className,
  trackHeight = 4,
}: SliderProps) {
  const ref = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);

  const updateFromEvent = (clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = Math.max(
      0,
      Math.min(100, ((clientX - rect.left) / rect.width) * 100),
    );
    onChange(pct);
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    draggingRef.current = true;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    updateFromEvent(e.clientX);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    updateFromEvent(e.clientX);
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
    onChangeEnd?.(value);
  };

  const clamped = Math.max(0, Math.min(100, value));
  const styleVars: CSSProperties = {
    height: trackHeight,
  };

  return (
    <div
      ref={ref}
      role="slider"
      tabIndex={0}
      aria-label={ariaLabel}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(clamped)}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') onChange(Math.min(100, value + 2));
        if (e.key === 'ArrowLeft') onChange(Math.max(0, value - 2));
        if (e.key === 'Home') onChange(0);
        if (e.key === 'End') onChange(100);
      }}
      className={cn(
        'group relative flex w-full cursor-pointer items-center select-none',
        className,
      )}>
      <div
        className="relative w-full overflow-hidden rounded-full bg-white/30"
        style={styleVars}>
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-white transition-colors group-hover:bg-pulse-accent"
          style={{ width: `${clamped}%` }}
        />
      </div>
      <span
        className="absolute h-3 w-3 -translate-x-1/2 rounded-full bg-white opacity-0 shadow-md transition-opacity group-hover:opacity-100 group-focus-within:opacity-100"
        style={{ left: `${clamped}%` }}
      />
    </div>
  );
}
