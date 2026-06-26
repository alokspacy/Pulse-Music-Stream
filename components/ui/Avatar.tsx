'use client';

import { cn } from '@/lib/utils';
import { useMemo, useState } from 'react';

interface AvatarProps {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  size?: number;
  className?: string;
}

export function Avatar({
  name,
  email,
  image,
  size = 36,
  className,
}: AvatarProps) {
  const [errored, setErrored] = useState(false);

  const initial = useMemo(() => {
    const source = (name ?? email ?? '?').trim();
    return source.charAt(0).toUpperCase() || '?';
  }, [name, email]);

  const showImage = Boolean(image) && !errored;
  const label = name ?? email ?? 'User';

  return (
    <div
      className={cn(
        'relative grid shrink-0 place-items-center overflow-hidden rounded-full bg-bg-elevated-highlight font-bold text-text-base select-none',
        className,
      )}
      style={{
        width: size,
        height: size,
        fontSize: Math.max(11, Math.round(size * 0.4)),
      }}
      aria-label={label}>
      {showImage ? (
        <img
          src={image as string}
          alt=""
          width={size}
          height={size}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onError={() => setErrored(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <span aria-hidden>{initial}</span>
      )}
    </div>
  );
}
