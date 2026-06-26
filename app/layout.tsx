import type { Metadata, Viewport } from 'next';
import { Figtree } from 'next/font/google';
import './globals.css';
import { AppShell } from '@/components/library/AppShell';
import { SessionProvider } from '@/components/auth/SessionProvider';
import { safeAuth } from '@/lib/auth';
import { LibraryHydrator } from '@/components/auth/LibraryHydrator';
import { loadLibrarySnapshot } from '@/lib/actions/library';

const figtree = Figtree({
  variable: '--font-figtree',
  subsets: ['latin'],
  weight: ['400', '500', '700', '900'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    template: '%s | Pulse',
    default: 'Pulse Music Stream - Listen on the web',
  },
  description:
    'A premium music streaming platform with live equalizer and visualizer, built with Next.js 16, Auth.js, Prisma, and the Deezer API.',
  applicationName: 'Pulse Music',
  authors: [{ name: 'Pulse Audio Engineering' }],
  icons: {
    icon: '/icon.svg',
  },
};

export const viewport: Viewport = {
  themeColor: '#0c0b0e',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await safeAuth();
  const librarySnapshot = await loadLibrarySnapshot();

  return (
    <html lang="en" className={figtree.variable}>
      <body className="bg-black text-white antialiased">
        <SessionProvider session={session}>
          <LibraryHydrator snapshot={librarySnapshot} />
          <AppShell>{children}</AppShell>
        </SessionProvider>
      </body>
    </html>
  );
}
