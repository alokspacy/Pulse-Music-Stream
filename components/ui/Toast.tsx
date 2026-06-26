'use client';

import { useToastStore } from '@/store/toastStore';
import { AnimatePresence, motion } from 'framer-motion';

export function ToastViewport() {
  const toasts = useToastStore((s) => s.toasts);
  return (
    <div className="pointer-events-none fixed bottom-28 left-1/2 z-[100] flex -translate-x-1/2 flex-col items-center gap-2">
      <AnimatePresence initial={false}>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.18 }}
            className="pointer-events-auto rounded-full bg-pulse-accent px-5 py-3 text-sm font-semibold text-black shadow-lg">
              {t.message}
            </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
