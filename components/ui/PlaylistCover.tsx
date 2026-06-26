import { cn } from '@/lib/utils';
import { Music2 } from 'lucide-react';

interface PlylistCoverProps {
  className?: string;
  iconSize?: number;
}

export function PlaylistCover({ className, iconSize = 28 }: PlylistCoverProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-center bg-linear-to-br from-zinc-700 via-zinc-800 to -zinc-950 text-text-subdued',
        className,
      )}>
      <Music2 size={iconSize} strokeWidth={2.4} />
    </div>
  );
}
