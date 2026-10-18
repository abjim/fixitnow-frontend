'use client';

import Link from 'next/link';
import { useState, useTransition } from 'react';
import { CalendarDays, CreditCard, Loader2, MapPin, Star } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { BookingBadge } from '@/components/status-badge';
import { cancelBookingAction } from '@/actions/booking';
import { createReviewAction } from '@/actions/review';
import { cn } from '@/lib/utils';
import { dateTime, taka } from '@/lib/format';
import type { Booking } from '@/lib/types';

const cancellable = ['REQUESTED', 'ACCEPTED', 'PAID'];

function ReviewDialog({ booking }: { booking: Booking }) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();

  const submit = (formData: FormData) => {
    startTransition(async () => {
      const result = await createReviewAction({}, formData);

      if (result.ok) {
        toast.success(result.message ?? 'Review submitted');
        setOpen(false);
        return;
      }

      setErrors(result.errors ?? {});
      if (result.message) toast.error(result.message);
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Star className="size-4" /> Leave review
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Review {booking.technician.user.name}</DialogTitle>
          <DialogDescription>
            How was the {booking.service.title.toLowerCase()} job?
          </DialogDescription>
        </DialogHeader>

        <form action={submit} className="space-y-4">
          <input type="hidden" name="bookingId" value={booking.id} />
          <input type="hidden" name="rating" value={rating} />

          <div className="space-y-2">
            <Label>Rating</Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRating(value)}
                  aria-label={`${value} star`}
                >
                  <Star
                    className={cn(
                      'size-7 transition-colors',
                      value <= rating
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-muted-foreground/40',
                    )}
                  />
                </button>
              ))}
            </div>
            {errors.rating && (
              <p className="text-sm text-destructive">{errors.rating}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor={`comment-${booking.id}`}>Comment (optional)</Label>
            <Textarea
              id={`comment-${booking.id}`}
              name="comment"
              rows={3}
              placeholder="Work was good, came on time..."
            />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="size-4 animate-spin" />}
              {isPending ? 'Submitting...' : 'Submit review'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function CancelDialog({ booking }: { booking: Booking }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [isPending, startTransition] = useTransition();

  const submit = () => {
    startTransition(async () => {
      const result = await cancelBookingAction(booking.id, reason);
      if (result.ok) {
        toast.success('Booking cancelled');
        setOpen(false);
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="ghost" className="text-destructive">
          Cancel
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cancel this booking?</DialogTitle>
          <DialogDescription>
            {booking.service.title} with {booking.technician.user.name}. You can
            not undo this.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Label htmlFor={`reason-${booking.id}`}>Reason (optional)</Label>
          <Textarea
            id={`reason-${booking.id}`}
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Plan changed..."
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Keep it
          </Button>
          <Button variant="destructive" onClick={submit} disabled={isPending}>
            {isPending && <Loader2 className="size-4 animate-spin" />}
            Cancel booking
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function CustomerBookingCard({ booking }: { booking: Booking }) {
  const paid = booking.payment?.status === 'COMPLETED';

  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-heading font-semibold">{booking.service.title}</p>
            <BookingBadge status={booking.status} />
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            with{' '}
            <Link
              href={`/technicians/${booking.technician.id}`}
              className="underline underline-offset-2"
            >
              {booking.technician.user.name}
            </Link>
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
      </div>

      {booking.cancelReason && (
        <p className="mt-2 text-sm text-muted-foreground">
          Reason: {booking.cancelReason}
        </p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-2 border-t pt-3">
        {booking.status === 'ACCEPTED' && !paid && (
          <Button size="sm" asChild>
            <Link href={`/dashboard/customer/bookings/${booking.id}/pay`}>
              <CreditCard className="size-4" /> Pay now
            </Link>
          </Button>
        )}

        {booking.status === 'COMPLETED' && !booking.review && (
          <ReviewDialog booking={booking} />
        )}

        {booking.review && (
          <span className="text-sm text-muted-foreground">
            You rated {booking.review.rating}/5
          </span>
        )}

        {cancellable.includes(booking.status) && <CancelDialog booking={booking} />}

        {booking.status === 'REQUESTED' && (
          <span className="text-sm text-muted-foreground">
            Waiting for the technician to accept.
          </span>
        )}
      </div>
    </div>
  );
}
