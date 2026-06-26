'use client';

import { ui } from '@/lib/styles';
import { usePlayerStore } from '@/store/playerStore';
import { Heart, Pause, Play, SkipForward } from 'lucide-react';
import Link from 'next/link';
import { CoverImage } from '../ui/CoverImage';
import { useToggleLikeTrack } from '@/lib/hooks/useToggleLikeTrack';

export function MobilePlayerBar() {
  const track = usePlayerStore((s) => s.currentTrack);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const progress = usePlayerStore((s) => s.progress);
  const { togglePlay, next } = usePlayerStore((s) => s.actions);
  const { liked, toggle: onToggleLike } = useToggleLikeTrack(track);

  return (
    <div className="relative mx-1 mb-1 overflow-hidden rounded-lg bg-bg-tinted-base">
      <div className="absolute inset-x-1 bottom-0.5 h-0.5 rounded-full bg-white/15">
        <div
          className="h-full rounded-full bg-white"
          style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
        />
      </div>

      <div className="flex items-center gap-3 px-3 py-2">
        {track ? (
          <>
            <Link href={`/album/${track.albumId}`}>
              <CoverImage
                src={track.coverUrl}
                alt=""
                size={40}
                shape="square"
                sizes="40px"
              />
            </Link>
            <div className="min-w-0 flex-1">
              <p className={ui.playerTitle}>{track.title}</p>
              <p className={ui.playerArtist}>{track.artist}</p>
            </div>

            <button
              type="button"
              aria-label={
                liked ? 'Remove from Liked Songs' : 'Save to Liked Songs'
              }
              onClick={onToggleLike}
              className="px-1 text-text-subdued transition active:scale-95">
              <Heart size={20} className={liked ? ui.heartActive : ''} />
            </button>

            <button
              type="button"
              aria-label={isPlaying ? 'Pause' : 'Play'}
              onClick={togglePlay}
              className="px-1 text-text-subdued transition active:scale-95">
              {isPlaying ? (
                <Pause size={22} className="fill-current" />
              ) : (
                <Play size={22} className="fill-current translate-x-[1px]" />
              )}
            </button>

            <button
              type="button"
              aria-label="Next"
              onClick={next}
              className="px-1 text-text-base transition  active:scale-95">
              <SkipForward size={20} className="fill-current" />
            </button>
          </>
        ) : (
          <div className="flex items-center gap-3 py-1 text-sm text-text-subdued">
            <div className="h-10 w-10 rounded bg-bg-elevated-base" />
            <div>
              <p className={`${ui.playerTitle} font-medium`}>Nothing playing</p>
              <p className={ui.playerArtist}>Pick a track to get started</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
