import { cn } from '@/lib/utils';
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Tooltip } from './Tooltip';

type Size = 'sm' | 'md' | 'lg';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  children: ReactNode;
  size?: Size;
  active?: boolean;
  tooltipSide?: 'top' | 'bottom' | 'left' | 'right';
}

const sizeMap: Record<Size, string> = {
  sm: 'h-7 w-7',
  md: 'h-8 w-8',
  lg: 'h-10 w-10',
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton(
    {
      label,
      children,
      size = 'md',
      active,
      className,
      tooltipSide = 'top',
      ...rest
    },
    ref,
  ) {
    return (
      <Tooltip label={label} side={tooltipSide}>
        <button
          ref={ref}
          type="button"
          aria-label={label}
          className={cn(
            'inline-flex shrink-0 items-center justify-center rounded-full text-text-subdued transition hover:text-text-base hover:scale-[1.04] active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40',
            active && 'text-pulse-accent hover:text-pulse-accent-bright',
            sizeMap[size],
            className,
          )}
          {...rest}>
          {children}
        </button>
      </Tooltip>
    );
  },
);
