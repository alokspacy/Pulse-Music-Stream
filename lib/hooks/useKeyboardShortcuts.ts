import { usePlayerStore } from '@/store/playerStore';
import { useEffect } from 'react';

const isEditable = (el: EventTarget | null): boolean => {
  if (!(el instanceof HTMLElement)) return false;
  const tag = el.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || el.isContentEditable;
};

export function useKeyboardShortcuts() {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (isEditable(e.target)) return;
      const { actions, volume, progress } = usePlayerStore.getState();
      switch (e.code) {
        case 'Space':
          e.preventDefault();
          actions.togglePlay();
          break;
        case 'ArrowRight':
          if (e.shiftKey) actions.next();
          else actions.seek(Math.min(100, progress + 5));
          break;
        case 'ArrowLeft':
          if (e.shiftKey) actions.previous();
          else actions.seek(Math.min(100, progress - 5));
          break;
        case 'ArrowUp':
          e.preventDefault();
          actions.setVolume(Math.min(1, volume + 0.05));
          break;
        case 'ArrowDown':
          e.preventDefault();
          actions.setVolume(Math.max(0, volume - 0.05));
          break;
        case 'keyM':
          actions.toggleMute();
          break;
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);
}
