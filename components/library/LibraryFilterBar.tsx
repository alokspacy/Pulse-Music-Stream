'use client';
import { LIBRARY_FILTERS } from '@/lib/library-constants';
import { filterChipClass, ui } from '@/lib/styles';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import type { LibraryFilter } from '@/store/libraryStore';
import type { ReactNode } from 'react';

interface LibraryFilterBarProps {
  filter: LibraryFilter;
  onFilterChange: (filter: LibraryFilter) => void;
  trailing?: ReactNode;
  className?: string;
}

export function LibraryFilterBar({
  filter,
  onFilterChange,
  trailing,
  className,
}: LibraryFilterBarProps) {
  return (
    <div
      className={cn('flex flex-wrap items-center gap-2 sm:gap-3', className)}>
      {filter !== 'all' && (
        <button
          type="button"
          onClick={() => onFilterChange('all')}
          aria-label="Clear filter"
          className={ui.filterClearBtn}>
          <X size={16} />
        </button>
      )}

      {/** Toggle pills - clicking an active pill deactivates it */}
      {LIBRARY_FILTERS.map((f) => (
        <button
          type="button"
          key={f.id}
          onClick={() => onFilterChange(filter === f.id ? 'all' : f.id)}
          className={cn(ui.filterChip, filterChipClass(filter === f.id))}>
          {f.label}
        </button>
      ))}

      {trailing}
    </div>
  );
}
