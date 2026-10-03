'use client';

import Link from 'next/link';
import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { loginAction, type FormState } from '@/actions/auth';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending && <Loader2 className="size-4 animate-spin" />}
      {pending ? 'Signing in...' : 'Sign in'}
    </Button>
  );
}

const demoAccounts = [
  { label: 'Customer', email: 'customer@fixitnow.com', password: 'Customer@123' },
  { label: 'Technician', email: 'rakib@fixitnow.com', password: 'Tech@1234' },
  { label: 'Admin', email: 'admin@fixitnow.com', password: 'Admin@1234' },
];

export function LoginForm({
  redirectTo,
  justRegistered,
}: {
  redirectTo?: string;
  justRegistered?: boolean;
}) {
  const [state, formAction] = useActionState<FormState, FormData>(loginAction, {});

  useEffect(() => {
    if (justRegistered) {
      toast.success('Account created. Please login now.');
    }
  }, [justRegistered]);

  useEffect(() => {
    if (state.message) toast.error(state.message);
  }, [state]);

  return (
    <div className="w-full max-w-sm">
      <h1 className="font-heading text-2xl font-bold">Welcome back</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Login to manage your bookings.
      </p>

      <form action={formAction} className="mt-6 space-y-4">
        <input type="hidden" name="redirectTo" value={redirectTo ?? ''} />

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            required
          />
          {state.errors?.email && (
            <p className="text-sm text-destructive">{state.errors.email}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            required
          />
          {state.errors?.password && (
            <p className="text-sm text-destructive">{state.errors.password}</p>
          )}
        </div>

        <SubmitButton />
      </form>

      <p className="mt-4 text-center text-sm text-muted-foreground">
        New here?{' '}
        <Link href="/register" className="font-medium text-foreground underline">
          Create an account
        </Link>
      </p>

      <div className="mt-8 rounded-lg border bg-muted/40 p-3">
        <p className="text-xs font-medium text-muted-foreground">
          Demo accounts (for testing)
        </p>
        <div className="mt-2 space-y-1">
          {demoAccounts.map((account) => (
            <p key={account.email} className="text-xs text-muted-foreground">
              <span className="font-medium text-foreground">{account.label}:</span>{' '}
              {account.email} / {account.password}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
