import { cn } from "@/lib/utils";

interface PulseLogoProps {
  className?: string;
  size?: number;
}

export function PulseLogo({ className, size = 32 }: PulseLogoProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      aria-hidden
      className={cn('shrink-0 text-pulse-accent-bright', className)}
    >
      <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="6" className="opacity-25" />
      {/* Dynamic Soundwave Bars */}
      <rect x="23" y="35" width="7" height="30" rx="3.5" fill="currentColor" />
      <rect x="35" y="20" width="7" height="60" rx="3.5" fill="currentColor" />
      <rect x="47" y="10" width="7" height="80" rx="3.5" fill="currentColor" />
      <rect x="59" y="25" width="7" height="50" rx="3.5" fill="currentColor" />
      <rect x="71" y="40" width="7" height="20" rx="3.5" fill="currentColor" />
    </svg>
  );
}
