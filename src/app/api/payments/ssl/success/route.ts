import { forwardToBackend, goTo, readCallback } from '@/lib/gateway';

async function handle(request: Request) {
  const fields = await readCallback(request);
  const transactionId = fields.tran_id ?? '';

  // backend verifies the val_id with sslcommerz before marking it paid
  const ok = await forwardToBackend('/api/payments/ssl/ipn', fields);

  if (!ok) {
    return goTo(
      request,
      `/payment/cancel?reason=${encodeURIComponent('We could not verify this payment. Please check your bookings.')}`,
    );
  }

  return goTo(request, `/payment/success?transactionId=${transactionId}`);
}

export const GET = handle;
export const POST = handle;
