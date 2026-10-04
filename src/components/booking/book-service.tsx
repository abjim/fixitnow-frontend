'use client';

import { useRouter } from 'next/navigation';
import { useActionState, useEffect, useMemo, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { CalendarDays, Loader2, LogIn } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { createBookingAction } from '@/actions/booking';
import { cn } from '@/lib/utils';
import { taka } from '@/lib/format';
import type { FormState } from '@/lib/forms';
import type { Availability, Service } from '@/lib/types';

// slots are generated in 1 hour steps inside the working hours
function buildSlots(availabilities: Availability[], date: string) {
  if (!date) return [];

  const day = new Date(`${date}T00:00:00+06:00`).getUTCDay();
  const forDay = availabilities.filter((slot) => slot.dayOfWeek === day);
  const slots: string[] = [];

  for (const block of forDay) {
    const [startHour] = block.startTime.split(':').map(Number);
    const [endHour] = block.endTime.split(':').map(Number);

    for (let hour = startHour; hour < endHour; hour++) {
      slots.push(`${String(hour).padStart(2, '0')}:00`);
    }
  }

  return [...new Set(slots)].sort();
}

function isPast(date: string, time: string) {
  return new Date(`${date}T${time}:00+06:00`).getTime() < Date.now();
}

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending || disabled}>
      {pending && <Loader2 className="size-4 animate-spin" />}
      {pending ? 'Sending request...' : 'Request booking'}
    </Button>
  );
}

type Props = {
  services: Service[];
  availabilities: Availability[];
  defaultServiceId?: string;
  isLoggedIn: boolean;
  isCustomer: boolean;
  acceptingBookings: boolean;
  technicianId: string;
};

export function BookService({
  services,
  availabilities,
  defaultServiceId,
  isLoggedIn,
  isCustomer,
  acceptingBookings,
  technicianId,
}: Props) {
  const router = useRouter();
  const [serviceId, setServiceId] = useState(
    defaultServiceId ?? services[0]?.id ?? '',
  );
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const [state, formAction] = useActionState<FormState, FormData>(
    createBookingAction,
    {},
  );

  const slots = useMemo(
    () => buildSlots(availabilities, date),
    [availabilities, date],
  );

  const selected = services.find((s) => s.id === serviceId);
  const today = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    if (state.ok) {
      toast.success(state.message ?? 'Booking request sent');
      setDate('');
      setTime('');
      router.push('/dashboard/customer/bookings');
    } else if (state.message) {
      toast.error(state.message);
    }
  }, [state, router]);

  if (!services.length) {
    return (
      <div className="rounded-xl border bg-card p-5">
        <p className="text-sm text-muted-foreground">
          This technician has not added any service yet.
        </p>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="rounded-xl border bg-card p-5">
        <p className="font-heading font-semibold">Book this technician</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Please login as a customer to make a booking.
        </p>
        <Button asChild className="mt-4 w-full">
          <a href={`/login?redirectTo=/technicians/${technicianId}`}>
            <LogIn className="size-4" /> Login to book
          </a>
        </Button>
      </div>
    );
  }

  if (!isCustomer) {
    return (
      <div className="rounded-xl border bg-card p-5">
        <p className="text-sm text-muted-foreground">
          Only a customer account can book a service.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="rounded-xl border bg-card p-5">
      <p className="font-heading font-semibold">Book this technician</p>

      {!acceptingBookings && (
        <p className="mt-3 rounded-md bg-muted p-3 text-sm text-muted-foreground">
          This technician is not taking new bookings right now.
        </p>
      )}

      <input type="hidden" name="serviceId" value={serviceId} />
      <input type="hidden" name="date" value={date} />
      <input type="hidden" name="time" value={time} />

      <div className="mt-4 space-y-4">
        <div className="space-y-2">
          <Label>Service</Label>
          <Select value={serviceId} onValueChange={setServiceId}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {services.map((service) => (
                <SelectItem key={service.id} value={service.id}>
                  {service.title} - {taka(service.price)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            min={today}
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              setTime('');
            }}
          />
          {state.errors?.date && (
            <p className="text-sm text-destructive">{state.errors.date}</p>
          )}
          {state.errors?.scheduledAt && (
            <p className="text-sm text-destructive">{state.errors.scheduledAt}</p>
          )}
        </div>

        {date && (
          <div className="space-y-2">
            <Label>Available time</Label>
            {slots.length === 0 ? (
              <p className="rounded-md bg-muted p-3 text-sm text-muted-foreground">
                <CalendarDays className="mr-1 inline size-3.5" />
                Technician does not work on this day. Try another date.
              </p>
            ) : (
              <div className="grid grid-cols-4 gap-2">
                {slots.map((slot) => {
                  const unavailable = isPast(date, slot);

                  return (
                    <button
                      key={slot}
                      type="button"
                      disabled={unavailable}
                      onClick={() => setTime(slot)}
                      className={cn(
                        'rounded-md border py-1.5 text-sm transition-colors',
                        time === slot && 'border-primary bg-primary text-primary-foreground',
                        unavailable &&
                          'cursor-not-allowed text-muted-foreground line-through opacity-50',
                        !unavailable && time !== slot && 'hover:bg-accent',
                      )}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="address">Your address</Label>
          <Input
            id="address"
            name="address"
            placeholder="House 12, Road 5, Dhanmondi"
            required
          />
          {state.errors?.address && (
            <p className="text-sm text-destructive">{state.errors.address}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="note">Note (optional)</Label>
          <Textarea
            id="note"
            name="note"
            rows={3}
            placeholder="Tell the technician what is wrong"
          />
        </div>

        {selected && (
          <div className="flex items-center justify-between rounded-md bg-muted p-3 text-sm">
            <span className="text-muted-foreground">Service charge</span>
            <span className="font-heading text-base font-bold">
              {taka(selected.price)}
            </span>
          </div>
        )}

        <SubmitButton disabled={!date || !time || !acceptingBookings} />

        <p className="text-center text-xs text-muted-foreground">
          You pay only after the technician accepts.
        </p>
      </div>
    </form>
  );
}
