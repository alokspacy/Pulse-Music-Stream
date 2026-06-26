import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server.js';
import { auth } from './lib/auth';

const AUTH_COOKIE_PATTERN =
  /^(?:__Secure-)?(?:authjs|next-auth)\.(?:session-token|csrf-token|callback-url)(?:\.\d+)?$/;

function hasAuthSessionCookie(req: NextRequest): boolean {
  return req.cookies.getAll().some((c) => AUTH_COOKIE_PATTERN.test(c.name));
}

export default async function proxy(req: NextRequest): Promise<NextResponse> {
  if (!hasAuthSessionCookie(req)) {
    return NextResponse.next();
  }

  try {
    await auth();
    return NextResponse.next();
  } catch {
    const cookieHeader = req.headers.get('cookie') ?? '';
    const cleanedCookieHeader = cookieHeader
      .split(/;\s*/)
      .filter((segment) => {
        if (!segment) return false;
        const name = segment.split('=')[0]?.trim() ?? '';
        return !AUTH_COOKIE_PATTERN.test(name);
      })
      .join('; ');

    const forwardedHeaders = new Headers(req.headers);
    if (cleanedCookieHeader) {
      forwardedHeaders.set('cookie', cleanedCookieHeader);
    } else {
      forwardedHeaders.delete('cookie');
    }

    const response = NextResponse.next({
      request: { headers: forwardedHeaders },
    });

    for (const cookie of req.cookies.getAll()) {
      if (AUTH_COOKIE_PATTERN.test(cookie.name)) {
        response.cookies.delete(cookie.name);
      }
    }
    return response;
  }
}

export const config = {
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon\\.ico|robots\\.txt|sitemap\\.xml|.*\\.(?:png|jpe?g|gif|svg|webp|avif|ico|css|js|map)$).*)"
  ]
}