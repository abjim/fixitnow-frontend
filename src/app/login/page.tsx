import type { Metadata } from 'next';
import { LoginForm } from '@/components/forms/login-form';
import { AuthAside } from '@/components/forms/auth-aside';

export const metadata: Metadata = { title: 'Login' };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirectTo?: string; registered?: string }>;
}) {
  const { redirectTo, registered } = await searchParams;

  return (
    <main className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-2">
      <div className="flex items-center justify-center px-4 py-12">
        <LoginForm redirectTo={redirectTo} justRegistered={registered === '1'} />
      </div>
      <AuthAside />
    </main>
  );
}
