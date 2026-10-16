'use server';

import { updateTag } from 'next/cache';
import { api, fieldErrors } from '@/lib/api';
import type { ActionResult, FormState } from '@/lib/forms';
import type { UserStatus } from '@/lib/types';

export async function updateUserStatusAction(
  userId: string,
  status: UserStatus,
): Promise<ActionResult> {
  const res = await api(`/api/admin/users/${userId}`, {
    method: 'PATCH',
    body: { status },
  });

  if (res.success) {
    updateTag('users');
    updateTag('technicians');
  }

  return { ok: res.success, message: res.message };
}

export async function saveCategoryAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const id = String(formData.get('id') ?? '');
  const name = String(formData.get('name') ?? '').trim();
  const description = String(formData.get('description') ?? '').trim();

  const body: Record<string, unknown> = { name };
  if (description) body.description = description;

  const res = id
    ? await api(`/api/admin/categories/${id}`, { method: 'PATCH', body })
    : await api('/api/admin/categories', { method: 'POST', body });

  if (!res.success) {
    return { message: res.message, errors: fieldErrors(res) };
  }

  updateTag('categories');
  return { ok: true, message: id ? 'Category updated' : 'Category created' };
}

export async function deleteCategoryAction(id: string): Promise<ActionResult> {
  const res = await api(`/api/admin/categories/${id}`, { method: 'DELETE' });

  if (res.success) updateTag('categories');
  return { ok: res.success, message: res.message };
}
