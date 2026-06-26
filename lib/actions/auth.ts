'use server';

import bcrypt from 'bcryptjs';
import { z, email } from 'zod';
import { prisma } from '@/lib/prisma';
import { signIn } from '@/lib/auth';

const registerSchema = z.object({
  name: z.string().trim().min(1).max(60),
  email: z
    .string()
    .email()
    .transform((v) => v.toLowerCase()),
  password: z.string().min(8).max(72),
});

export type RegisterResult = { ok: true } | { ok: false; error: string };

export async function registerUser(input: unknown): Promise<RegisterResult> {
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? 'Invalid input',
    };
  }
  const { name, email, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { ok: false, error: 'An account with the email already exists' };
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.user.create({
    data: { name, email, passwordHash },
  });

  return { ok: true };
}

export async function loginWithCredentials(formData: FormData): Promise<void> {
  await signIn('credentials', {
    email: formData.get('email'),
    password: formData.get('password'),
    redirectTo: '/',
  });
}

export async function loginWithProvider(
  provider: 'github' | 'google',
): Promise<void> {
  await signIn(provider, { redirectTo: '/' });
}
