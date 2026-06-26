import NextAuth, { type Session } from 'next-auth';
import { authConfig } from './config';

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);

export async function safeAuth(): Promise<Session | null> {
  try {
    return await auth();
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(
        '[safeAuth] session read failed, treating as anonymous',
        err,
      );
    }
    return null;
  }
}
