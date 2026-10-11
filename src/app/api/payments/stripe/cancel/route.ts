import { goTo, readCallback } from '@/lib/gateway';

export async function GET(request: Request) {
  await readCallback(request);
  return goTo(request, '/payment/cancel');
}
