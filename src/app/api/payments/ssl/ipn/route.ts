import { NextResponse } from 'next/server';
import { forwardToBackend, readCallback } from '@/lib/gateway';

// server to server call from sslcommerz, no redirect here
export async function POST(request: Request) {
  const fields = await readCallback(request);
  const ok = await forwardToBackend('/api/payments/ssl/ipn', fields);

  return NextResponse.json({ success: ok }, { status: ok ? 200 : 400 });
}
