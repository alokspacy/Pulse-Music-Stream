import { coverShapeClass, ui } from '@/lib/styles';
import { cn } from '@/lib/utils';
import Image from 'next/image';

type CoverShape = 'square' | 'circle' | 'rounded';

interface CoverImageProps {
  src?: string;
  alt: string;
  size: number;
  shape?: CoverShape;
  sizes?: string;
  className?: string;
  priority?: boolean;
}

export function CoverImage({
  src,
  alt,
  size,
  shape = 'square',
  sizes,
  className,
  priority,
}: CoverImageProps) {
  return (
    <div
      className={cn(
        'relative shrink-0 overflow-hidden',
        ui.coverPlaceholder,
        coverShapeClass(shape),
        className,
      )}
      style={{ width: size, height: size }}>
      {src && (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes ?? `${size}px`}
          priority={priority}
          className="object-cover"
        />
      )}
    </div>
  );
}
