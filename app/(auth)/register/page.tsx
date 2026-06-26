import { OAuthButtons } from '@/components/auth/OAuthButtons';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { ui } from '@/lib/styles';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Sign up',
  description: 'Create a free Pulse account.',
};

export default function RegisterPage() {
  return (
    <>
      <header className="flex flex-col gap-2 text-center sm:text-left">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-pulse-accent-bright">
          Join free
        </p>
        <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
          Create your Pulse account
        </h1>
        <p className="text-sm text-text-subdued">
          It only takes a moment. Start streaming immediately.
        </p>
      </header>

      <OAuthButtons />

      <div
        role="separator"
        className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-text-subdued">
        <span className={ui.authDividerLine} />
        or sign up with email
        <span className={ui.authDividerLine} />
      </div>

      <RegisterForm />

      <p className="text-center text-sm text-text-subdued">
        Already have an account?{' '}
        <Link
          href="/login"
          className="font-semibold text-white underline-offset-4 transition hover:text-pulse-accent-bright hover:underline">
          Log in
        </Link>
      </p>
    </>
  );
}
