'use client';
import { useSyncExternalStore } from "react";

function subscribe(query: string){
  return (onChange: () => void) => {
    if(typeof window === undefined) return () => {};
    const mql = window.matchMedia(query);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }
}

function getSnapshot(query: string){
  return () => window.matchMedia(query).matches;
}

function getServerSnapshot(){
  return false;
}

export function useMMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    subscribe(query),
    getSnapshot(query),
    getServerSnapshot
  )
}

export const useIsMobile = () => useMMediaQuery('(max-width: 767px)');
export const useIsTablet = () => useMMediaQuery('(min-width: 768px) and (max-width: 1023px)');
export const useIsDesktop = () => useMMediaQuery('(min-width: 1024px)');