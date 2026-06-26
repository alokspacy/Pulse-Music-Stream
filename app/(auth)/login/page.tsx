import { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { OAuthButtons } from '@/components/auth/OAuthButtons';
import { ui } from '@/lib/styles';
import { LoginForm } from '@/components/auth/LoginForm';

export const metadata: Metadata = {
  title: 'Log in',
  description: 'Log in to your Pulse account.',
};

export default function LoginPage() {
  return (
    <>
      <header className="flex flex-col gap-2 text-center sm:text-left">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-pulse-accent-bright">
          Welcome back
        </p>
        <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
          Log in to Pulse
        </h1>
        <p className="text-sm text-text-subdued">
          Pick up where you left off - your library is waiting.
        </p>
      </header>

      <OAuthButtons />

      <div
        role="separator"
        className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-text-subdued">
        <span className={ui.authDividerLine} />
        or continue with email
        <span className={ui.authDividerLine} />
      </div>

      <Suspense
        fallback={<div className="h-64 animate-pulse rounded-xl bg-white/5" />}>
        <LoginForm />
      </Suspense>

      <p className="text-center text-sm text-text-subdued">
        Don't have an account?{' '}
        <Link
          href="/register"
          className="font-semibold text-white underline-offset-4 hover:text-pulse-accent-bright hover:underline">
          Sign up for Pulse
        </Link>
      </p>
    </>
  );
}
