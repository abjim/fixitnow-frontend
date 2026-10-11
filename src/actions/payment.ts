'use server';

import { updateTag } from 'next/cache';
import { api } from '@/lib/api';
import type { PaymentProvider } from '@/lib/types';

type StartPaymentResult = {
  ok: boolean;
  message: string;
  paymentUrl?: string;
};

export async function startPaymentAction(
  bookingId: string,
  provider: PaymentProvider,
): Promise<StartPaymentResult> {
  const res = await api<{ paymentUrl: string; transactionId: string }>(
    '/api/payments/create',
    { method: 'POST', body: { bookingId, provider } },
  );

  if (!res.success) {
    return { ok: false, message: res.message };
  }

  updateTag('payments');
  return { ok: true, message: res.message, paymentUrl: res.data.paymentUrl };
}

export async function confirmPaymentAction(
  transactionId: string,
  valId?: string,
) {
  const res = await api(`/api/payments/confirm`, {
    method: 'POST',
    body: { transactionId, valId },
  });

  if (res.success) {
    updateTag('payments');
    updateTag('bookings');
  }

  return { ok: res.success, message: res.message };
}
