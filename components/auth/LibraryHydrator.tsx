'use client';

import { useLibraryStore } from '@/store/libraryStore';
import { useEffect } from 'react';
import { LibrarySnapshot } from '../../lib/actions/library';

interface Props {
  snapshot: LibrarySnapshot;
}

export function LibraryHydrator({ snapshot }: Props) {
  const hydrate = useLibraryStore((s) => s.hydrate);
  useEffect(() => {
    hydrate(snapshot);
  }, [hydrate, snapshot]);
  return null;
}
