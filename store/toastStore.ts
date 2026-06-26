'use client';

import { create } from 'zustand';

export interface ToastItem {
  id: number;
  message: string;
}

interface ToastState {
  toasts: ToastItem[];
  push: (message: string) => void;
  remove: (id: number) => void;
}

const AUTO_DISMISS_MS = 2500;

let counter = 0;

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  push: (message) => {
    const id = ++counter;
    set((s) => ({ toasts: [...s.toasts, { id, message }] }));

    setTimeout(() => {
      set((s) => ({
        toasts: s.toasts.filter((t) => t.id !== id),
      }));
    }, AUTO_DISMISS_MS);
  },
  remove: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));
