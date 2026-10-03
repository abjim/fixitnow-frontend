import { NextResponse, type NextRequest } from 'next/server';
import type { Role } from '@/lib/types';

type TokenPayload = {
  userId: string;
  email: string;
  role: Role;
  exp: number;
};

const roleHome: Record<Role, string> = {
  ADMIN: '/dashboard/admin',
  TECHNICIAN: '/dashboard/technician',
  CUSTOMER: '/dashboard/customer',
};

const authPages = ['/login', '/register'];

function decodeToken(token: string): TokenPayload | null {
  try {
    const payload = token.split('.')[1];
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(normalized));
  } catch {
    return null;
  }
}

function isExpired(payload: TokenPayload) {
  return payload.exp * 1000 < Date.now();
}

async function refreshAccessToken(refreshToken: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh-token`,
      {
        method: 'POST',
        headers: { Cookie: `refreshToken=${refreshToken}` },
      },
    );
    const json = await res.json();
    return json?.data?.accessToken as string | undefined;
  } catch {
    return undefined;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;

  let payload = accessToken ? decodeToken(accessToken) : null;
  let freshToken: string | undefined;

  // access token is gone or expired, try to get a new one with refresh token
  if ((!payload || isExpired(payload)) && refreshToken) {
    freshToken = await refreshAccessToken(refreshToken);
    payload = freshToken ? decodeToken(freshToken) : null;
  }

  const attachToken = (response: NextResponse) => {
    if (freshToken) {
      response.cookies.set('accessToken', freshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 30,
      });
    }
    return response;
  };

  const isAuthPage = authPages.includes(pathname);

  if (!payload || isExpired(payload)) {
    if (isAuthPage) return NextResponse.next();

    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirectTo', pathname + search);
    return NextResponse.redirect(loginUrl);
  }

  const home = roleHome[payload.role];

  if (isAuthPage) {
    return attachToken(NextResponse.redirect(new URL(home, request.url)));
  }

  if (pathname === '/dashboard') {
    return attachToken(NextResponse.redirect(new URL(home, request.url)));
  }

  // customer should not open technician or admin dashboard
  if (!pathname.startsWith(home)) {
    return attachToken(NextResponse.redirect(new URL(home, request.url)));
  }

  return attachToken(NextResponse.next());
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register'],
};
