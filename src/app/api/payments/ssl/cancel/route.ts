import { forwardToBackend, goTo, readCallback } from '@/lib/gateway';

async function handle(request: Request) {
  const fields = await readCallback(request);
  await forwardToBackend('/api/payments/ssl/cancel', fields);

  return goTo(request, '/payment/cancel');
}

export const GET = handle;
export const POST = handle;
