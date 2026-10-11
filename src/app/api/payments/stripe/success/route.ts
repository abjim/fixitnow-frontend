import { goTo, readCallback } from '@/lib/gateway';

export async function GET(request: Request) {
  const fields = await readCallback(request);
  const transactionId = fields.transactionId ?? '';

  // the success page shows the live status and can re-check it
  return goTo(request, `/payment/success?transactionId=${transactionId}`);
}
