'use client';

import { cn } from '@/lib/utils';
import { Play } from 'lucide-react';

type Variant = 'card' | 'quick' | 'search';

interface CardPlayOverlayProps {
  label: string;
  onClick: (e: React.MouseEvent) => void;
  variant?: Variant;
}

const VARIANT_STYLES: Record<Variant, string> = {
  card: 'right-2 bottom-2 h-12 w-12 translate-y-2 group-hover:translate-y-0 group-focus-within:translate-y-0 shadow-[0_8px_16px_rgba(0,0,0,0.6)]',
  quick: 'right-0 mr-4 h-10 w-10 translate-x-2 group-hover:trnaslate-x-0',
  search:
    'bottom-5 right-5 h-12 w-12 translate-y-2 group-hover:translate-y-0 shadow-lg',
};

const ICON_SIZES: Record<Variant, number> = {
  card: 20,
  quick: 18,
  search: 20,
};

export function CardPlayOverlay({
  label,
  onClick,
  variant = 'card',
}: CardPlayOverlayProps) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick(e);
      }}
      className={cn(
        'absolute flex items-center justify-center rounded-full bg-pulse-accent text-black',
        'opacity-0 transition-all duration-200 hover:scale-105 hover:bg-pulse-accent-bright',
        'group-hover:opacity-100 group-focus-within:opacity-100',
        VARIANT_STYLES[variant],
      )}>
      <Play
        size={ICON_SIZES[variant]}
        className="fill-black translate-x-[1px]"
      />
    </button>
  );
}
