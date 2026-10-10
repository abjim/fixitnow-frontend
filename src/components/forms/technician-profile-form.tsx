'use client';

import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { updateTechnicianProfileAction } from '@/actions/technician';
import type { FormState } from '@/lib/forms';
import type { TechnicianProfile } from '@/lib/types';

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending && <Loader2 className="size-4 animate-spin" />}
      Save profile
    </Button>
  );
}

export function TechnicianProfileForm({ profile }: { profile: TechnicianProfile }) {
  const [state, formAction] = useActionState<FormState, FormData>(
    updateTechnicianProfileAction,
    {},
  );

  useEffect(() => {
    if (state.ok) toast.success(state.message ?? 'Profile updated');
    else if (state.message) toast.error(state.message);
  }, [state]);

  const errors = state.errors ?? {};

  return (
    <form action={formAction} className="max-w-2xl space-y-5">
      <div className="rounded-xl border bg-card p-5">
        <p className="font-heading font-semibold">Basic info</p>

        <div className="mt-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bio">About you</Label>
            <Textarea
              id="bio"
              name="bio"
              rows={3}
              defaultValue={profile.bio ?? ''}
              placeholder="Licensed plumber working in Dhaka since 2020."
            />
            {errors.bio && <p className="text-sm text-destructive">{errors.bio}</p>}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" name="city" defaultValue={profile.city} required />
              {errors.city && (
                <p className="text-sm text-destructive">{errors.city}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="serviceArea">Service area</Label>
              <Input
                id="serviceArea"
                name="serviceArea"
                defaultValue={profile.serviceArea ?? ''}
                placeholder="Mirpur, Kazipara"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="experienceYears">Experience (years)</Label>
              <Input
                id="experienceYears"
                name="experienceYears"
                type="number"
                min={0}
                max={60}
                defaultValue={profile.experienceYears}
              />
              {errors.experienceYears && (
                <p className="text-sm text-destructive">
                  {errors.experienceYears}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="hourlyRate">Hourly rate (৳)</Label>
              <Input
                id="hourlyRate"
                name="hourlyRate"
                type="number"
                min={0}
                defaultValue={profile.hourlyRate}
              />
              {errors.hourlyRate && (
                <p className="text-sm text-destructive">{errors.hourlyRate}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="skills">Skills</Label>
            <Input
              id="skills"
              name="skills"
              defaultValue={profile.skills.join(', ')}
              placeholder="pipe fitting, leak repair"
            />
            <p className="text-xs text-muted-foreground">Separate with comma</p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-card p-5">
        <div className="flex items-start gap-3">
          <Checkbox
            id="isAvailable"
            name="isAvailable"
            defaultChecked={profile.isAvailable}
          />
          <div>
            <Label htmlFor="isAvailable">Taking new bookings</Label>
            <p className="mt-1 text-sm text-muted-foreground">
              Turn this off when you are on leave. Your profile stays visible but
              customers can not book you.
            </p>
          </div>
        </div>
      </div>

      <SaveButton />
    </form>
  );
}
