'use client';

import { registerUser } from '@/lib/actions/auth';
import { Lock, Mail, User as UserIcon } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useId, useState, type FormEvent } from 'react';
import {
  AuthErrorPanel,
  AuthFormField,
  AuthSubmitButton,
  PasswordStrengthMeter,
} from './AuthFields';

export function RegisterForm() {
  const router = useRouter();
  const nameId = useId();
  const emailId = useId();
  const passwordId = useId();
  const strengthId = useId();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      const res = await registerUser({ name, email, password });
      if (!res.ok) {
        setError(res.error);
        return;
      }
      const login = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });
      if (!login || login.error) {
        setError('Account created but sign-in failed, please log in manually.');
        router.push('/login');
        return;
      }
      router.push('/');
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
      <AuthFormField
        id={nameId}
        label="What should we call you?"
        type="text"
        value={name}
        onChange={setName}
        placeholder="Display name"
        icon={<UserIcon size={18} />}
        required
        autoComplete="name"
        minLength={1}
        maxLength={60}
        hint={
          <p className="text-xs text-text-subdued">
            This appears on your profile and playlists.
          </p>
        }
      />

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
        placeholder="Create a strong password"
        icon={<Lock size={18} />}
        required
        autoComplete="new-password"
        minLength={8}
        describedBy={strengthId}
        hint={<PasswordStrengthMeter password={password} id={strengthId} />}
      />

      {error && <AuthErrorPanel message={error} />}

      <AuthSubmitButton pending={pending} pendingLabel="Creating account...">
        Create account
      </AuthSubmitButton>
    </form>
  );
}
