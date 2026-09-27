import { cookies } from 'next/headers';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export type Meta = {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
};

export type ErrorDetail = { path: string; message: string };

export type ApiResponse<T> = {
  success: boolean;
  statusCode: number;
  message: string;
  meta?: Meta;
  data: T;
  errorDetails?: ErrorDetail[];
};

type ApiOptions = {
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  body?: unknown;
  tags?: string[];
  revalidate?: number | false;
  auth?: boolean;
  token?: string;
};

// backend cors only allows localhost, so every call goes through the
// next server (server component / server action) instead of the browser
export async function api<T>(
  path: string,
  options: ApiOptions = {},
): Promise<ApiResponse<T>> {
  const { method = 'GET', body, tags, revalidate, auth = true, token } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (auth) {
    const accessToken = token ?? (await cookies()).get('accessToken')?.value;
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }
  }

  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      next: tags ? { tags, revalidate } : undefined,
      cache: tags ? undefined : 'no-store',
    });

    const json = await res.json();
    return json as ApiResponse<T>;
  } catch {
    return {
      success: false,
      statusCode: 500,
      message: 'Can not connect to the server. Please try again.',
      data: null as T,
    };
  }
}

// turns backend errorDetails into { field: message } for inline form errors
export function fieldErrors(res: ApiResponse<unknown>) {
  const errors: Record<string, string> = {};
  for (const item of res.errorDetails ?? []) {
    if (item.path && !errors[item.path]) {
      errors[item.path] = item.message;
    }
  }
  return errors;
}
