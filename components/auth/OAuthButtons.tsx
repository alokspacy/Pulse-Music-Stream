'use client';

import { signIn } from 'next-auth/react';
import { useEffect, useState } from 'react';

interface ProviderAvailability {
  google: boolean;
}

export function OAuthButtons() {
  const [available, setAvailable] = useState<ProviderAvailability | null>();

  useEffect(() => {
    fetch('/api/auth/providers', { cache: 'no-store' })
      .then((r) => r.json())
      .then((json) => {
        setAvailable({
          google: Boolean(json?.google),
        });
      })
      .catch(() => setAvailable({ google: false }));
  }, []);

  if (!available) {
    return (
      <div className="flex flex-col gap-2.5" aria-hidden>
        <div className="h-11 animate-pulse rounded-full bg-white/5" />
      </div>
    );
  }

  if (!available.google) {
    return (
      <div className="rounded-lg border border-white/10 bg-white/3 px-3.5 py-3 text-xs leading-relaxed text-text-subdued">
        <span className="font-semibold text-white">
          Google OAuth is not configured
        </span>{' '}
        Set{' '}
        <code className="rounded bg-black/60 px-1.5 py-0.5 font-mono text-[11px] text-white">
          AUTH_GOOGLE_ID
        </code>{' '}
        in{' '}
        <code className="rounded bg-black/60 px-1.5 py-0.5 font-mono text-[11px] text-white">
          .env
        </code>{' '}
        to enable it. Email + password works either way.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2.5">
      {available.google && (
        <ProviderButton
          provider="google"
          label="Continue with Google"
          icon={<GoogleMark />}
        />
      )}
    </div>
  );
}

interface ProviderButtonProps {
  provider: 'google';
  label: string;
  icon: React.ReactNode;
}

function ProviderButton({ provider, label, icon }: ProviderButtonProps) {
  return (
    <button
      type="button"
      onClick={() => signIn(provider, { callbackUrl: '/' })}
      className="group inline-flex w-full items-center justify-center gap-3 rounded-full border border-white/10 bg-white/4 px-4 py-3 text-sm font-semibold text-white transition hover:border-white/25 hover:bg-white/8 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40">
      <span className="inline-flex h-5 w-5 items-center justify-center">
        {icon}
      </span>
      {label}
    </button>
  );
}

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" width={20} height={20} aria-hidden>
      <path
        fill="#EA4335"
        d="M12 11v3.5h5a4.99 4.99 0 0 1-2.16 3.27l3.5 2.71c2.04-1.88 3.22-4.65 3.22-7.95 0-.77-.07-1.5-.2-2.2H12Z"
      />
      <path
        fill="#34A853"
        d="m6.27 14.29-.79.6L2.6 17.1A10 10 0 0 0 12 22c2.7 0 4.96-.9 6.62-2.42l-3.5-2.71c-.96.65-2.19 1.04-3.62 1.04-2.78 0-5.13-1.87-5.97-4.39l-1.26-.23Z"
      />
      <path
        fill="#4A90E2"
        d="M2.6 6.9a10 10 0 0 0 0 10.2L6.27 14.3a6.04 6.04 0 0 1 0-3.61L2.6 6.9Z"
      />
      <path
        fill="#FBBC05"
        d="M12 5.79c1.47 0 2.79.51 3.83 1.5l2.87-2.87A10 10 0 0 0 12 2a10 10 0 0 0-9.4 4.9l3.67 2.79C7.11 7.16 9.34 5.79 12 5.79Z"
      />
    </svg>
  );
}
