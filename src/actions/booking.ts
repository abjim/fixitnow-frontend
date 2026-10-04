'use server';

import { updateTag } from 'next/cache';
import { api, fieldErrors } from '@/lib/api';
import type { ActionResult, FormState } from '@/lib/forms';
import type { Booking, BookingStatus } from '@/lib/types';

export async function createBookingAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const serviceId = String(formData.get('serviceId') ?? '');
  const date = String(formData.get('date') ?? '');
  const time = String(formData.get('time') ?? '');
  const address = String(formData.get('address') ?? '').trim();
  const note = String(formData.get('note') ?? '').trim();

  if (!date || !time) {
    return { errors: { date: 'Please pick a date and time' } };
  }

  // the picker gives bd local time, backend wants utc
  const scheduledAt = new Date(`${date}T${time}:00+06:00`).toISOString();

  const res = await api<Booking>('/api/bookings', {
    method: 'POST',
    body: { serviceId, scheduledAt, address, note: note || undefined },
  });

  if (!res.success) {
    return { message: res.message, errors: fieldErrors(res) };
  }

  updateTag('bookings');
  return { ok: true, message: 'Booking request sent' };
}

export async function cancelBookingAction(
  bookingId: string,
  cancelReason: string,
): Promise<ActionResult> {
  const res = await api(`/api/bookings/${bookingId}/cancel`, {
    method: 'PATCH',
    body: cancelReason ? { cancelReason } : {},
  });

  if (res.success) updateTag('bookings');
  return { ok: res.success, message: res.message };
}

export async function updateBookingStatusAction(
  bookingId: string,
  status: BookingStatus,
): Promise<ActionResult> {
  const res = await api(`/api/technician/bookings/${bookingId}`, {
    method: 'PATCH',
    body: { status },
  });

  if (res.success) updateTag('bookings');
  return { ok: res.success, message: res.message };
}
