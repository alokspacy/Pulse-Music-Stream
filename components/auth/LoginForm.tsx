'use client';

import { Lock, Mail } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useId, useState, type FormEvent } from 'react';
import { AuthErrorPanel, AuthFormField, AuthSubmitButton } from './AuthFields';

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get('callbackUrl') ?? '/';
  const emailId = useId();
  const passwordId = useId();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });
      if (!res || res.error) {
        setError(
          res?.code === 'credentials'
            ? 'Incorrect email or password'
            : 'Could notsign in. Please try again',
        );
        return;
      }
      router.push(callbackUrl);
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
      <AuthFormField
        id={emailId}
        label="Email address"
        type="email"
        value={email}
        onChange={setEmail}
        placeholder="you@example.com"
        icon={<Mail size={18} />}
        required
        autoComplete="email"
      />

      <AuthFormField
        id={passwordId}
        label="Password"
        type="password"
        value={password}
        onChange={setPassword}
        placeholder="Enter your password"
        icon={<Mail size={18} />}
        required
        autoComplete="current-password"
      />

      {error && <AuthErrorPanel message={error} />}

      <AuthSubmitButton pending={pending} pendingLabel="Signing in...">
        Log in
      </AuthSubmitButton>
    </form>
  );
}
