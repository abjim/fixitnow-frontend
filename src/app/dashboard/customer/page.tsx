import Link from 'next/link';
import { CalendarRange, CheckCircle2, CreditCard, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader, StatCard } from '@/components/dashboard/page-header';
import { CustomerBookingCard } from '@/components/booking/customer-booking-card';
import { EmptyState } from '@/components/empty-state';
import { getMyBookings, getMyPayments } from '@/lib/queries';
import { getCurrentUser } from '@/lib/session';
import { taka } from '@/lib/format';

export default async function CustomerOverviewPage() {
  const [user, bookingsRes, paymentsRes] = await Promise.all([
    getCurrentUser(),
    getMyBookings({ limit: 50 }),
    getMyPayments({ limit: 50 }),
  ]);

  const bookings = bookingsRes.data ?? [];
  const payments = paymentsRes.data ?? [];

  const active = bookings.filter((b) =>
    ['REQUESTED', 'ACCEPTED', 'PAID', 'IN_PROGRESS'].includes(b.status),
  );
  const completed = bookings.filter((b) => b.status === 'COMPLETED');
  const spent = payments
    .filter((p) => p.status === 'COMPLETED')
    .reduce((sum, p) => sum + p.amount, 0);
  const awaitingPayment = bookings.filter(
    (b) => b.status === 'ACCEPTED' && b.payment?.status !== 'COMPLETED',
  );

  return (
    <>
      <PageHeader
        title={`Hello, ${user?.name.split(' ')[0] ?? 'there'}`}
        description="Here is what is going on with your bookings."
        action={
          <Button asChild>
            <Link href="/services">Book a service</Link>
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Active bookings" value={active.length} icon={CalendarRange} />
        <StatCard label="Completed" value={completed.length} icon={CheckCircle2} />
        <StatCard label="Total spent" value={taka(spent)} icon={Wallet} />
        <StatCard
          label="Awaiting payment"
          value={awaitingPayment.length}
          icon={CreditCard}
          hint={awaitingPayment.length ? 'Pay to confirm the job' : undefined}
        />
      </div>

      <section className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-heading text-lg font-bold">Recent bookings</h2>
          <Button asChild variant="ghost" size="sm">
            <Link href="/dashboard/customer/bookings">View all</Link>
          </Button>
        </div>

        {bookings.length === 0 ? (
          <EmptyState
            title="No bookings yet"
            description="Browse services and book a technician to get started."
            icon={CalendarRange}
          >
            <Button asChild>
              <Link href="/services">Browse services</Link>
            </Button>
          </EmptyState>
        ) : (
          <div className="space-y-3">
            {bookings.slice(0, 4).map((booking) => (
              <CustomerBookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
