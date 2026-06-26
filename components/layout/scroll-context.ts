'use client';

import { createContext, useContext, type RefObject } from "react";

interface ScrollContextValue {
  scrollRef: RefObject<HTMLElement | null>
}

export const ScrollContext = createContext<ScrollContextValue | null>(null);

export function useScrollContainer() {
  const ctx = useContext(ScrollContext);
  if(!ctx) {
    throw new Error('useScrollContainer must be used inside AppShell');
  }
  return ctx;
}
