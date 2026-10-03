import type { Metadata } from 'next';
import { RegisterForm } from '@/components/forms/register-form';
import { AuthAside } from '@/components/forms/auth-aside';

export const metadata: Metadata = { title: 'Create account' };

export default function RegisterPage() {
  return (
    <main className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-2">
      <div className="flex items-center justify-center px-4 py-12">
        <RegisterForm />
      </div>
      <AuthAside />
    </main>
  );
}
