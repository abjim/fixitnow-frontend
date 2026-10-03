'use client';

import Link from 'next/link';
import { useActionState, useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { Loader2, UserRound, Wrench } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { registerAction, type FormState } from '@/actions/auth';
import { cn } from '@/lib/utils';
import type { Role } from '@/lib/types';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending && <Loader2 className="size-4 animate-spin" />}
      {pending ? 'Creating account...' : 'Create account'}
    </Button>
  );
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

export function RegisterForm() {
  const [role, setRole] = useState<Role>('CUSTOMER');
  const [state, formAction] = useActionState<FormState, FormData>(
    registerAction,
    {},
  );

  useEffect(() => {
    if (state.message) toast.error(state.message);
  }, [state]);

  const errors = state.errors ?? {};

  return (
    <div className="w-full max-w-md">
      <h1 className="font-heading text-2xl font-bold">Create your account</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Book a service or start taking jobs as a technician.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-3">
        {(
          [
            { value: 'CUSTOMER', label: 'I need a service', icon: UserRound },
            { value: 'TECHNICIAN', label: 'I am a technician', icon: Wrench },
          ] as const
        ).map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setRole(option.value)}
            className={cn(
              'flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-colors',
              role === option.value
                ? 'border-primary bg-accent'
                : 'hover:bg-muted',
            )}
          >
            <option.icon className="size-4" />
            <span className="font-medium">{option.label}</span>
          </button>
        ))}
      </div>

      <form action={formAction} className="mt-5 space-y-4">
        <input type="hidden" name="role" value={role} />

        <Field id="name" label="Full name" error={errors.name}>
          <Input id="name" name="name" placeholder="Tanvir Ahmed" required />
        </Field>

        <Field id="email" label="Email" error={errors.email}>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            required
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="password" label="Password" error={errors.password}>
            <Input id="password" name="password" type="password" required />
          </Field>
          <Field
            id="confirmPassword"
            label="Confirm password"
            error={errors.confirmPassword}
          >
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
            />
          </Field>
        </div>

        <Field id="phone" label="Phone (optional)" error={errors.phone}>
          <Input id="phone" name="phone" placeholder="01712345678" />
        </Field>

        {role === 'TECHNICIAN' && (
          <div className="space-y-4 rounded-lg border bg-muted/40 p-4">
            <p className="text-sm font-medium">Technician details</p>

            <Field id="city" label="City" error={errors.city}>
              <Input id="city" name="city" placeholder="Dhaka" required />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                id="experienceYears"
                label="Experience (years)"
                error={errors.experienceYears}
              >
                <Input
                  id="experienceYears"
                  name="experienceYears"
                  type="number"
                  min={0}
                  placeholder="3"
                />
              </Field>
              <Field id="hourlyRate" label="Hourly rate" error={errors.hourlyRate}>
                <Input
                  id="hourlyRate"
                  name="hourlyRate"
                  type="number"
                  min={0}
                  placeholder="450"
                />
              </Field>
            </div>

            <Field id="skills" label="Skills" error={errors.skills}>
              <Input
                id="skills"
                name="skills"
                placeholder="pipe fitting, leak repair"
              />
              <p className="text-xs text-muted-foreground">Separate with comma</p>
            </Field>
          </div>
        )}

        <SubmitButton />
      </form>

      <p className="mt-4 text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-foreground underline">
          Login
        </Link>
      </p>
    </div>
  );
}
