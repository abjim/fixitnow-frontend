'use server';

import { redirect } from 'next/navigation';
import { fieldErrors, type ApiResponse } from '@/lib/api';
import {
  clearSession,
  dashboardPath,
  readRefreshToken,
  saveSession,
} from '@/lib/session';
import type { Role, User } from '@/lib/types';

export type FormState = {
  message?: string;
  errors?: Record<string, string>;
};

type LoginData = { accessToken: string; user: User };

export async function loginAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');
  const redirectTo = String(formData.get('redirectTo') ?? '');

  if (!email || !password) {
    return { message: 'Email and password both are required' };
  }

  let role: Role;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        cache: 'no-store',
      },
    );

    const json = (await res.json()) as ApiResponse<LoginData>;

    if (!json.success) {
      return { message: json.message, errors: fieldErrors(json) };
    }

    // refresh token comes back as a Set-Cookie header from the backend
    const refreshToken = readRefreshToken(res.headers.get('set-cookie'));
    await saveSession(json.data.accessToken, refreshToken);

    role = json.data.user.role;
  } catch {
    return { message: 'Can not connect to the server. Please try again.' };
  }


  // if user was pushed to login from a private page, send them back there
  if (redirectTo && redirectTo.startsWith('/')) {
    redirect(redirectTo);
  }

  redirect(dashboardPath(role));
}

export async function registerAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const role = String(formData.get('role') ?? 'CUSTOMER') as Role;
  const password = String(formData.get('password') ?? '');
  const confirmPassword = String(formData.get('confirmPassword') ?? '');

  if (password !== confirmPassword) {
    return { errors: { confirmPassword: 'Password did not match' } };
  }

  const payload: Record<string, unknown> = {
    name: String(formData.get('name') ?? '').trim(),
    email: String(formData.get('email') ?? '').trim(),
    password,
    role,
  };

  const phone = String(formData.get('phone') ?? '').trim();
  const address = String(formData.get('address') ?? '').trim();
  if (phone) payload.phone = phone;
  if (address) payload.address = address;

  if (role === 'TECHNICIAN') {
    payload.city = String(formData.get('city') ?? '').trim();
    const experience = formData.get('experienceYears');
    const rate = formData.get('hourlyRate');
    const skills = String(formData.get('skills') ?? '').trim();

    if (experience) payload.experienceYears = Number(experience);
    if (rate) payload.hourlyRate = Number(rate);
    if (skills) {
      payload.skills = skills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    }
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        cache: 'no-store',
      },
    );

    const json = (await res.json()) as ApiResponse<User>;

    if (!json.success) {
      return { message: json.message, errors: fieldErrors(json) };
    }
  } catch {
    return { message: 'Can not connect to the server. Please try again.' };
  }

  redirect('/login?registered=1');
}

export async function logoutAction() {
  await clearSession();
  redirect('/login');
}
