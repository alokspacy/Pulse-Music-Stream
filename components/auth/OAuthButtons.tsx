'use client';

import { signIn } from 'next-auth/react';
import { useEffect, useState } from 'react';

interface ProviderAvailability {
  github: boolean;
  google: boolean;
}

export function OAuthButtons() {
  const [available, setAvailable] = useState<ProviderAvailability | null>();

  useEffect(() => {
    fetch('/api/auth/providers', { cache: 'no-store' })
      .then((r) => r.json())
      .then((json) => {
        setAvailable({
          github: Boolean(json?.github),
          google: Boolean(json?.google),
        });
      })
      .catch(() => setAvailable({ github: false, google: false }));
  }, []);

  if (!available) {
    return (
      <div className="flex flex-col gap-2.5" aria-hidden>
        <div className="h-11 animate-pulse rounded-full bg-white/5" />
        <div className="h-11 animate-pulse rounded-full bg-white/5" />
      </div>
    );
  }

  if (!available.github && !available.google) {
    return (
      <div className="rounded-lg border border-white/10 bg-white/3 px-3.5 py-3 text-xs leading-relaxed text-text-subdued">
        <span className="font-semibold text-white">
          OAuth providers aren't configured
        </span>{' '}
        Set{' '}
        <code className="rounded bg-black/60 px-1.5 py-0.5 font-mono text-[11px] text-white">
          AUTH_GITHUB_ID
        </code>{' '}
        /{' '}
        <code className="rounded bg-black/60 px-1.5 py-0.5 font-mono text-[11px] text-white">
          AUTH_GOOGLE_ID
        </code>{' '}
        in{' '}
        <code className="rounded bg-black/60 px-1.5 py-0.5 font-mono text-[11px] text-white">
          .env
        </code>{' '}
        to enable them. Email + password works either way.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2.5">
      {available.github && (
        <ProviderButton
          provider="github"
          label="Continue with GitHub"
          icon={<GitHubMark />}
        />
      )}
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
  provider: 'github' | 'google';
  label: string;
  icon: React.ReactNode;
}

function ProviderButton({ provider, label, icon }: ProviderButtonProps) {
  return (
    <button
      type="button"
      onClick={() => signIn(provider, { callbackUrl: '/' })}
      className="group inline-flex w-full items-center justify-center gap-3 rounded-full border border-white/10 bg-white/4 px-4 py-3 text-sm font-semibold text-white transition hover:border-white/25 hover:bg-white/8 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40">
      <span className="inlin-flex h-5 w-5 items-center justify-center">
        {icon}
      </span>
      {label}
    </button>
  );
}

function GitHubMark() {
  return (
    <svg
      viewBox="0 0 24 24"
      width={20}
      height={20}
      fill="currentColor"
      aria-hidden>
      <path d="M12 .5a11.5 11.5 0 0 0-3.63 22.42c.58.1.79-.25.79-.55v-2.06c-3.2.7-3.87-1.36-3.87-1.36-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.74 2.68 1.24 3.34.95.1-.74.4-1.24.72-1.52-2.55-.29-5.24-1.27-5.24-5.66 0-1.25.45-2.27 1.18-3.07-.12-.29-.51-1.45.11-3.02 0 0 .96-.31 3.15 1.17a11 11 0 0 1 5.74 0c2.19-1.48 3.15-1.17 3.15-1.17.62 1.57.23 2.73.11 3.02.74.8 1.18 1.82 1.18 3.07 0 4.4-2.7 5.37-5.26 5.65.41.35.78 1.05.78 2.12v3.14c0 .3.21.66.8.55A11.5 11.5 0 0 0 12 .5Z" />
    </svg>
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
