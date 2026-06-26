'use client';

import Image from 'next/image';
import Link from 'next/link';
import { CardPlayOverlay } from '../ui/CardPlayOverlay';
import { coverShapeClass, ui } from '@/lib/styles';
import { cn } from '@/lib/utils';

interface ContentCardProps {
  imageUrl: string;
  title: string;
  subtitle?: string;
  href: string;
  variant?: 'album' | 'artist' | 'playlist';
  onPlay?: (e: React.MouseEvent) => void;
}

export function ContentCard({
  imageUrl,
  title,
  subtitle,
  href,
  variant = 'playlist',
  onPlay,
}: ContentCardProps) {
  const isArtist = variant === 'artist';

  return (
    <Link href={href} className={ui.contentCard}>
      <div className="relative mb-4">
        <div
          className={cn(
            'relative aspect-square w-full overflow-hidden',
            ui.coverPlaceholder,
            coverShapeClass(isArtist ? 'circle' : 'square'),
            ui.coverShadow,
          )}>
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes="(max-width: 768px) 50vw, 200px"
            className="object-cover"
          />
        </div>
        {onPlay && (
          <CardPlayOverlay
            label={`Play ${title}`}
            onClick={onPlay}
            variant="card"
          />
        )}
      </div>
      <div className="min-w-0 space-y-1">
        <p className="truncate text-base font-bold text-text-base">{title}</p>
        {subtitle && (
          <p className="line-clamp-2 text-sm text-text-subdued">{subtitle}</p>
        )}
      </div>
    </Link>
  );
}
