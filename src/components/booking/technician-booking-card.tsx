'use client';

import { useTransition } from 'react';
import { CalendarDays, Check, Loader2, MapPin, Phone, Play, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { BookingBadge } from '@/components/status-badge';
import { updateBookingStatusAction } from '@/actions/booking';
import { dateTime, taka } from '@/lib/format';
import type { Booking, BookingStatus } from '@/lib/types';

export function TechnicianBookingCard({ booking }: { booking: Booking }) {
  const [isPending, startTransition] = useTransition();

  const run = (status: BookingStatus, successText: string) => {
    startTransition(async () => {
      const result = await updateBookingStatusAction(booking.id, status);
      if (result.ok) toast.success(successText);
      else toast.error(result.message);
    });
  };

  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-heading font-semibold">{booking.service.title}</p>
            <BookingBadge status={booking.status} />
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {booking.customer.name}
          </p>
        </div>
        <p className="font-heading text-lg font-bold">{taka(booking.price)}</p>
      </div>

      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <CalendarDays className="size-3.5" />
          {dateTime(booking.scheduledAt)}
        </span>
        <span className="flex items-center gap-1.5">
          <MapPin className="size-3.5" />
          {booking.address}
        </span>
        {booking.customer.phone && (
          <a
            href={`tel:${booking.customer.phone}`}
            className="flex items-center gap-1.5 hover:text-foreground"
          >
            <Phone className="size-3.5" />
            {booking.customer.phone}
          </a>
        )}
      </div>

      {booking.note && (
        <p className="mt-3 rounded-md bg-muted p-3 text-sm">{booking.note}</p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-2 border-t pt-3">
        {isPending && <Loader2 className="size-4 animate-spin text-muted-foreground" />}

        {booking.status === 'REQUESTED' && (
          <>
            <Button
              size="sm"
              disabled={isPending}
              onClick={() => run('ACCEPTED', 'Booking accepted')}
            >
              <Check className="size-4" /> Accept
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={isPending}
              onClick={() => run('DECLINED', 'Booking declined')}
            >
              <X className="size-4" /> Decline
            </Button>
          </>
        )}

        {booking.status === 'ACCEPTED' && (
          <span className="text-sm text-muted-foreground">
            Waiting for the customer to pay.
          </span>
        )}

        {booking.status === 'PAID' && (
          <Button
            size="sm"
            disabled={isPending}
            onClick={() => run('IN_PROGRESS', 'Job started')}
          >
            <Play className="size-4" /> Start job
          </Button>
        )}

        {booking.status === 'IN_PROGRESS' && (
          <Button
            size="sm"
            disabled={isPending}
            onClick={() => run('COMPLETED', 'Job completed')}
          >
            <Check className="size-4" /> Mark completed
          </Button>
        )}

        {booking.status === 'COMPLETED' && booking.review && (
          <span className="text-sm text-muted-foreground">
            Customer rated {booking.review.rating}/5
          </span>
        )}
      </div>
    </div>
  );
}
