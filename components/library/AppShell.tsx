'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useRef, type ReactNode } from 'react';
import { Sidebar } from '../layout/Sidebar';
import { useLibraryStore } from '@/store/libraryStore';
import { ScrollContext } from '../layout/scroll-context';
import { MobileTopBar } from '../layout/MobileTopBar';
import { PlayerBar } from '../layout/PlayerBar';
import { MobilePlayerBar } from '../layout/MobilePlayerBar';
import { ToastViewport } from '../ui/Toast';
import { useAudioEngine } from '@/lib/hooks/useAudio';
import { useKeyboardShortcuts } from '@/lib/hooks/useKeyboardShortcuts';

interface AppShellProps {
  children: ReactNode;
}

const AUTH_ROUTES = new Set(['/login', '/register']);

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const scrollRef = useRef<HTMLElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  useAudioEngine(audioRef);
  useKeyboardShortcuts();

  const mobileNavOpen = useLibraryStore((s) => s.mobileNavOpen);
  const setMobileOpen = useLibraryStore((s) => s.setMobileNavOpen);

  if (AUTH_ROUTES.has(pathname)) {
    return (
      <>
        {children}
        <ToastViewport />
        <audio
          ref={audioRef}
          preload="auto"
          playsInline
          hidden
          aria-hidden="true"
        />
      </>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-black p-1 gap-1 sm:p-2 overflow-hidden">
      <div className="relative flex min-h-0 flex-1 gap-2">
        <div className="hidden md:flex md:flex-col">
          <Sidebar forceCollapsedOn="md" />
        </div>

        {/* Mobile drawer */}
        <AnimatePresence>
          {mobileNavOpen && (
            <>
              <motion.div
                key="scrim"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="fixed inset-0 z-40 bg-black/60 md:hidden"
                onClick={() => setMobileOpen(false)}
              />
              <motion.div
                key="drawer"
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', stiffness: 320, damping: 36 }}
                className="fixed inset-y-1 left-1 z-50 flex w-[86vw] max-w-[340px] flex-col md:hidden">
                <Sidebar
                  alwaysExpanded
                  onNavigate={() => setMobileOpen(false)}
                />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <main
          ref={scrollRef}
          className="relative min-w-0 flex-1 overflow-y-auto rounded-lg bg-bg-base">
          <ScrollContext.Provider value={{ scrollRef }}>
            <MobileTopBar onMenu={() => setMobileOpen(true)} />
            {children}
          </ScrollContext.Provider>
        </main>
      </div>

      <div className="hidden sm:block">
        <PlayerBar />
      </div>
      <div className="sm:hidden">
        <MobilePlayerBar />
      </div>

      {/* Toast */}
      <ToastViewport />

      {/* hidden <audio> element backing the player, controlled imperativly */}
      <audio
        ref={audioRef}
        preload="auto"
        playsInline
        hidden
        aria-hidden="true"
      />
    </div>
  );
}
