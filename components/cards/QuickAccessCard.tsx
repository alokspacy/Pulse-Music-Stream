'use client';

import Image from 'next/image';
import Link from 'next/link';
import { CardPlayOverlay } from '../ui/CardPlayOverlay';
import { LikedSongsCover } from '../ui/LikedSongsCover';
import { ui } from '@/lib/styles';

interface QuickAccessCardProps {
  imageUrl: string;
  title: string;
  href: string;
  onPlay?: (e: React.MouseEvent) => void;
}

export function QuickAccessCard({
  imageUrl,
  title,
  href,
  onPlay,
}: QuickAccessCardProps) {
  const isLiked = imageUrl === 'liked';
  return (
    <Link href={href} className={ui.quickAccessCard}>
      {isLiked ? (
        <LikedSongsCover className="h-16 w-16 shrink-0" iconSize={23} />
      ) : (
        <div className={`relative h-16 w-16 shrink-0 ${ui.coverPlaceholder}`}>
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes="64px"
            priority
            className="object-cover"
          />
        </div>
      )}
      <span className="min-w-0 flex-1 truncate pr-3 text-sm font-bold text-text-base">
        {title}
      </span>
      {onPlay && (
        <CardPlayOverlay
          label={`Play ${title}`}
          onClick={onPlay}
          variant="quick"
        />
      )}
    </Link>
  );
}
