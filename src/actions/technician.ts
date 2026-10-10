'use server';

import { updateTag } from 'next/cache';
import { api, fieldErrors } from '@/lib/api';
import type { ActionResult, FormState } from '@/lib/forms';

export async function updateTechnicianProfileAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const skills = String(formData.get('skills') ?? '').trim();

  const body: Record<string, unknown> = {
    bio: String(formData.get('bio') ?? '').trim(),
    city: String(formData.get('city') ?? '').trim(),
    serviceArea: String(formData.get('serviceArea') ?? '').trim(),
    experienceYears: Number(formData.get('experienceYears') ?? 0),
    hourlyRate: Number(formData.get('hourlyRate') ?? 0),
    isAvailable: formData.get('isAvailable') === 'on',
    skills: skills
      ? skills.split(',').map((s) => s.trim()).filter(Boolean)
      : [],
  };

  const res = await api('/api/technician/profile', { method: 'PUT', body });

  if (!res.success) {
    return { message: res.message, errors: fieldErrors(res) };
  }

  updateTag('technician-profile');
  updateTag('technicians');
  return { ok: true, message: 'Profile updated' };
}

type Slot = { dayOfWeek: number; startTime: string; endTime: string };

export async function updateAvailabilityAction(
  slots: Slot[],
): Promise<ActionResult> {
  if (!slots.length) {
    return { ok: false, message: 'Add at least one time slot' };
  }

  const res = await api('/api/technician/availability', {
    method: 'PUT',
    body: { slots },
  });

  if (res.success) {
    updateTag('availability');
    updateTag('technicians');
  }

  return { ok: res.success, message: res.message };
}

export async function saveServiceAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const id = String(formData.get('id') ?? '');

  const body = {
    title: String(formData.get('title') ?? '').trim(),
    description: String(formData.get('description') ?? '').trim(),
    price: Number(formData.get('price') ?? 0),
    durationMinutes: Number(formData.get('durationMinutes') ?? 60),
    categoryId: String(formData.get('categoryId') ?? ''),
  };

  const res = id
    ? await api(`/api/technician/services/${id}`, { method: 'PATCH', body })
    : await api('/api/technician/services', { method: 'POST', body });

  if (!res.success) {
    return { message: res.message, errors: fieldErrors(res) };
  }

  updateTag('my-services');
  updateTag('services');
  return { ok: true, message: id ? 'Service updated' : 'Service created' };
}

export async function deleteServiceAction(id: string): Promise<ActionResult> {
  const res = await api(`/api/technician/services/${id}`, { method: 'DELETE' });

  if (res.success) {
    updateTag('my-services');
    updateTag('services');
  }

  return { ok: res.success, message: res.message };
}
