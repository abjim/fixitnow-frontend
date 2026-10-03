import { cache } from 'react';
import { cookies } from 'next/headers';
import { api } from '@/lib/api';
import type { Role, User } from '@/lib/types';

export const ACCESS_TOKEN = 'accessToken';
export const REFRESH_TOKEN = 'refreshToken';

const THIRTY_DAYS = 60 * 60 * 24 * 30;

export async function saveSession(accessToken: string, refreshToken?: string) {
  const store = await cookies();

  store.set(ACCESS_TOKEN, accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: THIRTY_DAYS,
  });

  if (refreshToken) {
    store.set(REFRESH_TOKEN, refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: THIRTY_DAYS,
    });
  }
}

export async function clearSession() {
  const store = await cookies();
  store.delete(ACCESS_TOKEN);
  store.delete(REFRESH_TOKEN);
}

// backend sends the refresh token as a Set-Cookie header, we keep it in
// our own cookie so the proxy can use it later
export function readRefreshToken(setCookie: string | null) {
  if (!setCookie) return undefined;
  const match = setCookie.match(/refreshToken=([^;]+)/);
  return match?.[1];
}

// cache() keeps it to one /me call per request even if many components ask
export const getCurrentUser = cache(async (): Promise<User | null> => {
  const token = (await cookies()).get(ACCESS_TOKEN)?.value;
  if (!token) return null;

  const res = await api<User>('/api/auth/me');
  if (!res.success) return null;

  return res.data;
});

export function dashboardPath(role: Role) {
  if (role === 'ADMIN') return '/dashboard/admin';
  if (role === 'TECHNICIAN') return '/dashboard/technician';
  return '/dashboard/customer';
}
