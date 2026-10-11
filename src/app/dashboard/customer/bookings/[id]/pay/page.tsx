import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { ArrowLeft, CalendarDays, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PayBooking } from '@/components/booking/pay-booking';
import { BookingBadge } from '@/components/status-badge';
import { getBooking } from '@/lib/queries';
import { dateTime, duration, taka } from '@/lib/format';

export default async function PayBookingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const res = await getBooking(id);

  if (!res.success || !res.data) notFound();

  const booking = res.data;

  // already paid, no reason to stay on this page
  if (booking.payment?.status === 'COMPLETED') {
    redirect(`/payment/success?transactionId=${booking.payment.transactionId}`);
  }

  const payable = booking.status === 'ACCEPTED';

  return (
    <>
      <Button asChild variant="ghost" size="sm" className="mb-4 -ml-2">
        <Link href="/dashboard/customer/bookings">
          <ArrowLeft className="size-4" /> Back to bookings
        </Link>
      </Button>

      <h1 className="font-heading text-2xl font-bold">Complete payment</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Pay for your booking to confirm the job.
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="rounded-xl border bg-card p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-heading font-semibold">{booking.service.title}</p>
            <BookingBadge status={booking.status} />
          </div>

          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Technician</dt>
              <dd className="font-medium">{booking.technician.user.name}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Category</dt>
              <dd>{booking.service.category.name}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="flex items-center gap-1.5 text-muted-foreground">
                <CalendarDays className="size-3.5" /> Schedule
              </dt>
              <dd>{dateTime(booking.scheduledAt)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Duration</dt>
              <dd>{duration(booking.service.durationMinutes)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="flex items-center gap-1.5 text-muted-foreground">
                <MapPin className="size-3.5" /> Address
              </dt>
              <dd className="text-right">{booking.address}</dd>
            </div>
          </dl>

          <div className="mt-4 flex items-center justify-between border-t pt-4">
            <span className="font-medium">Total payable</span>
            <span className="font-heading text-2xl font-bold">
              {taka(booking.price)}
            </span>
          </div>
        </div>

        <div>
          {payable ? (
            <PayBooking bookingId={booking.id} />
          ) : (
            <div className="rounded-xl border bg-card p-5">
              <p className="font-heading font-semibold">Payment not available</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Payment opens only after the technician accepts the booking.
                Current status is{' '}
                <span className="font-medium">{booking.status}</span>.
              </p>
              <Button asChild variant="outline" className="mt-4 w-full">
                <Link href="/dashboard/customer/bookings">Back to bookings</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
