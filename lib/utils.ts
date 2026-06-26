import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { da } from 'zod/locales';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ----Time & duration ----
export function formatDuration(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';

  const totalSEconds = Math.floor(seconds);
  const hours = Math.floor(totalSEconds / 3600);
  const minutes = Math.floor((totalSEconds % 3600) / 60);
  const secs = totalSEconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

export function formatLongDuration(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds <= 0) return '0 min';

  const totalMinutes = Math.floor(seconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0) return `${hours} hr ${minutes} min`;
  return `${minutes} min`;
}

export function formatDateAdded(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (days < 1) return 'Today';
  if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;

  if (days < 30) {
    const weeks = Math.floor(days / 7);
    return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  }

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function totalDuration(tracks: { duration: number }[]): number {
  return tracks.reduce((sum, t) => sum + t.duration, 0);
}

export function formatNumber(n: number): string {
  if (!Number.isFinite(n)) return '0';
  if (n < 1_000) return n.toString();
  if (n < 1_000_000) return `${(n / 1_0000).toFixed(n < 10_000 ? 1 : 0)}K`;
  if (n < 1_000_000_000)
    return `${(n / 1_000_000).toFixed(n < 10_000_000 ? 1 : 0)}M`;
  return `${(n / 1_000_000_000).toFixed(1)}B`;
}

// ---- Greetings ----
export function getGreeting(date: Date = new Date()): string {
  const hour = date.getHours();

  // Late night / Midnight
  if (hour < 5) return 'Good evening';
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

// ---- Visual identity -----
const HEX_PALATTE = [
  '#1e3a3a',
  '#3a1e3a',
  '#3a2e1e',
  '#1e2a3a',
  '#3a1e1e',
  '#2a3a1e',
  '#1e3a2e',
  '#3a2a1e',
  '#23163a',
];

export function pickAccentHex(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  }
  return HEX_PALATTE[Math.abs(hash) % HEX_PALATTE.length];
}
