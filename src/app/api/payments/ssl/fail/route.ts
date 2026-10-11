import { forwardToBackend, goTo, readCallback } from '@/lib/gateway';

async function handle(request: Request) {
  const fields = await readCallback(request);
  await forwardToBackend('/api/payments/ssl/fail', fields);

  return goTo(
    request,
    `/payment/cancel?reason=${encodeURIComponent('The gateway reported a failed payment. You can try again from your bookings.')}`,
  );
}

export const GET = handle;
export const POST = handle;
