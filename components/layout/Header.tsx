'use client';

import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, type ReactNode } from 'react';
import { UserMenu } from '../auth/UserMenu';

interface HeaderProps {
  scrollContainerRef?: React.RefObject<HTMLElement | null>;
  fadeThreshold?: number;
  accent?: string;
  stickyContent?: ReactNode;
}

export function Header({
  scrollContainerRef,
  fadeThreshold = 280,
  accent = 'transparent',
  stickyContent,
}: HeaderProps) {
  const router = useRouter();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const el = scrollContainerRef?.current;
    if (!el) return;
    const handler = () => setScrollY(el.scrollTop);
    el.addEventListener('scroll', handler, { passive: true });
    return () => el.removeEventListener('scroll', handler);
  }, [scrollContainerRef]);

  const opacity = Math.min(1, scrollY / fadeThreshold);
  const revealSticky = scrollY > fadeThreshold * 0.7;

  return (
    <header className="sticky top-0 hidden sm:block z-30">
      <div
        aria-hidden
        className="absolute inset-0 transition-colors"
        style={{
          background: accent,
          opacity,
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 backdrop-blur-md transition-opacity"
        style={{
          background: 'rgba(18,18,18,0.6)',
          opacity,
        }}
      />
      <div className="relative flex items-center justify-between gap-4 px-4 py-3 sm:px-6 sm:py-4">
        <div className="flex min-w-0 items-center gap-2">
          <button
            type="button"
            aria-label="Go back"
            onClick={() => router.back()}
            className="hidden h-8 w-8 place-items-center rounded-full bg-black/70 text-text-base hover:scale-105 sm:grid">
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            aria-label="Go forward"
            onClick={() => router.forward()}
            className="hidden h-8 w-8 place-items-center rounded-full bg-black/70 text-text-base hover:scale-105 sm:grid">
            <ChevronRight size={20} />
          </button>
          <div
            className={cn(
              'ml-0 flex min-w-0 items-center gap-3 transition-all duration-200 sm:ml-2',
              revealSticky
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-2 pointer-events-none',
            )}>
            {stickyContent}
          </div>
        </div>
        <div className="hidden items-center gap-3 sm:flex">
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
