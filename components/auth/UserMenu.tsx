'use client';

import { ui } from '@/lib/styles';
import { LogOut, User as UserIcon } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { Menu } from '../ui/Menu';
import { Avatar } from '../ui/Avatar';

export function UserMenu() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div className="h-9 w-24 animate-pulse rounded-full bg-white/5" />;
  }

  if (!session?.user) {
    return (
      <>
        <Link
          href="/register"
          className="rounded-full text-sm font-bold text-text-subdued transition hover:scale-[1.04] hover:text-text-base">
          Sign up
        </Link>
        <Link
          href="/login"
          className="rounded-full bg-white px-6 py-2 text-sm font-bold text-black transition hover:scale-[1.04]">
          Log in
        </Link>
      </>
    );
  }

  return (
    <Menu
      panelClassName="right-0 top-12 w-56"
      trigger={({
        onClick,
        'aria-haspopup': haspopup,
        'aria-expanded': expanded,
      }) => (
        <button
          type="button"
          onClick={onClick}
          aria-haspopup={haspopup}
          aria-expanded={expanded}
          aria-label="Open account menu"
          className="rounded-full ring-2 ring-transparent transition hover:ring-white/30 focus-within:ring-white/30">
          <Avatar
            name={session.user.name}
            email={session.user.email}
            image={session.user.image}
            size={36}
          />
        </button>
      )}>
      {(close) => (
        <>
          <div className="px-3 py-2 text-xs text-text-subdued">
            Signed in as
            <div className="truncate text-sm font-semibold text-text-base">
              {session.user.name ?? session.user.email}
            </div>
          </div>
          <hr className="my-1 border-white/10" />
          <Link
            href="/library"
            role="menuitem"
            className={ui.menuItem}
            onClick={() => close()}>
            <UserIcon size={16} /> Your Library
          </Link>
          <button
            type="button"
            role="menuitem"
            className={ui.menuItem}
            onClick={() => {
              close();
              void signOut({ callbackUrl: '/' });
            }}>
            <LogOut size={16} /> Log out
          </button>
        </>
      )}
    </Menu>
  );
}
