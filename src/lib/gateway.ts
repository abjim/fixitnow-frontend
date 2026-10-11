import { NextResponse } from 'next/server';

const API = process.env.NEXT_PUBLIC_API_URL;

// the gateway posts a normal html form, not json
export async function readCallback(request: Request) {
  const url = new URL(request.url);
  const fields: Record<string, string> = {};

  url.searchParams.forEach((value, key) => {
    fields[key] = value;
  });

  if (request.method === 'POST') {
    try {
      const form = await request.formData();
      form.forEach((value, key) => {
        fields[key] = String(value);
      });
    } catch {
      // nothing to read, query string is enough
    }
  }

  return fields;
}

// backend does the real validation against sslcommerz, we only forward
export async function forwardToBackend(path: string, body: Record<string, string>) {
  try {
    const res = await fetch(`${API}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(body).toString(),
      cache: 'no-store',
    });
    return res.ok;
  } catch {
    return false;
  }
}

export function goTo(request: Request, path: string) {
  return NextResponse.redirect(new URL(path, request.url), { status: 303 });
}
