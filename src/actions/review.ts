'use server';

import { updateTag } from 'next/cache';
import { api, fieldErrors } from '@/lib/api';
import type { FormState } from '@/lib/forms';

export async function createReviewAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const bookingId = String(formData.get('bookingId') ?? '');
  const rating = Number(formData.get('rating') ?? 0);
  const comment = String(formData.get('comment') ?? '').trim();

  if (!rating) {
    return { errors: { rating: 'Please give a rating' } };
  }

  const res = await api(`/api/reviews`, {
    method: 'POST',
    body: { bookingId, rating, comment: comment || undefined },
  });

  if (!res.success) {
    return { message: res.message, errors: fieldErrors(res) };
  }

  updateTag('bookings');
  updateTag('reviews');
  return { ok: true, message: 'Thanks for the review' };
}
