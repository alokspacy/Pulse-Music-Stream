'use client';

import { ui } from '@/lib/styles';
import Link from 'next/link';
import type { ReactNode } from 'react';

interface SectionRowProps {
  title: string;
  href?: string;
  subtitle?: string;
  children: ReactNode;
}

export function SectionRow({
  title,
  href,
  subtitle,
  children,
}: SectionRowProps) {
  return (
    <section className="space-y-3">
      <div className="flex items-end justify-between px-1">
        <div>
          {href ? (
            <Link href={href} className={`${ui.sectionTitle} hover:underline`}>
              {title}
            </Link>
          ) : (
            <h2 className={ui.sectionTitle}>{title}</h2>
          )}
          {subtitle && (
            <p className="mt-1 text-sm text-text-subdued">{subtitle}</p>
          )}
        </div>
        {href && (
          <Link href={href} className={ui.sectionShowAll}>
            Show all
          </Link>
        )}
      </div>
      <div className={ui.cardGrid}>{children}</div>
    </section>
  );
}
