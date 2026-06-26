'use client';

import { Menu } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface MobiletopBarProps {
  onMenu: () => void;
}

export function MobileTopBar({ onMenu }: MobiletopBarProps) {
  const pathname = usePathname();
  return (
    <div className="sticky top-0 z-30 flex items-center gap-3 bg-bg-base/85 px-4 py-2 backdrop-blur md:hidden">
      <button
        type="button"
        aria-label="Open menu"
        onClick={onMenu}
        className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/10 text-text-base active:scale-95">
        <Menu size={20} />
      </button>

      <nav className="flex min-w-0 flex-1 items-center gap-2 overflow-x-auto no-scrollbar text-sm font-bold">
        <Link
          href="/"
          className={`shrink-0 rounded-full px-3 py-1.5 ${pathname === '/' ? 'bg-white text-black' : 'bg-white/10 text-text-base'}`}>
          Home
        </Link>

        <Link
          href="/search"
          className={`shrink-0 rounded-full px-3 py-1.5 ${pathname.startsWith('/search') ? 'bg-white text-black' : 'bg-white/10 text-text-base'}`}>
          Search
        </Link>

        <Link
          href="/library"
          className={`shrink-0 rounded-full px-3 py-1.5 ${pathname.startsWith('/library') ? 'bg-white text-black' : 'bg-white/10 text-text-base'}`}>
          Library
        </Link>
      </nav>
    </div>
  );
}
