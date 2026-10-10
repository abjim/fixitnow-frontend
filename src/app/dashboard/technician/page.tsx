import Link from 'next/link';
import { CalendarRange, Star, TrendingUp, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PageHeader, StatCard } from '@/components/dashboard/page-header';
import { TechnicianBookingCard } from '@/components/booking/technician-booking-card';
import { EmptyState } from '@/components/empty-state';
import { getTechnicianBookings, getTechnicianProfile } from '@/lib/queries';
import { taka } from '@/lib/format';

export default async function TechnicianOverviewPage() {
  const [profileRes, bookingsRes] = await Promise.all([
    getTechnicianProfile(),
    getTechnicianBookings({ limit: 50, sortBy: 'createdAt', sortOrder: 'desc' }),
  ]);

  const profile = profileRes.data;
  const bookings = bookingsRes.data ?? [];

  const pending = bookings.filter((b) => b.status === 'REQUESTED');
  const upcoming = bookings.filter((b) =>
    ['ACCEPTED', 'PAID', 'IN_PROGRESS'].includes(b.status),
  );
  const earnings = bookings
    .filter((b) => b.payment?.status === 'COMPLETED')
    .reduce((sum, b) => sum + b.price, 0);

  return (
    <>
      <PageHeader
        title="Technician dashboard"
        description="Your jobs, earnings and requests at a glance."
        action={
          <Button asChild variant="outline">
            <Link href="/dashboard/technician/availability">Set availability</Link>
          </Button>
        }
      />

      {profile && !profile.isAvailable && (
        <div className="mb-6 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm dark:border-amber-500/30 dark:bg-amber-500/10">
          You are marked as <strong>not available</strong>, so customers can not
          book you.{' '}
          <Link
            href="/dashboard/technician/profile"
            className="font-medium underline"
          >
            Turn it on from profile
          </Link>
          .
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="New requests" value={pending.length} icon={CalendarRange} />
        <StatCard label="Upcoming jobs" value={upcoming.length} icon={TrendingUp} />
        <StatCard label="Earnings" value={taka(earnings)} icon={Wallet} />
        <StatCard
          label="Rating"
          value={profile?.avgRating ? profile.avgRating.toFixed(1) : 'New'}
          icon={Star}
          hint={profile ? `${profile.totalReviews} reviews` : undefined}
        />
      </div>

      {profile && (
        <div className="mt-6 rounded-xl border bg-card p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-heading font-semibold">{profile.user.name}</p>
              <p className="text-sm text-muted-foreground">
                {profile.serviceArea || profile.city} · {profile.experienceYears}{' '}
                years experience · {taka(profile.hourlyRate)}/hr
              </p>
            </div>
            <Badge variant={profile.isAvailable ? 'default' : 'secondary'}>
              {profile.isAvailable ? 'Taking bookings' : 'Paused'}
            </Badge>
          </div>

          {profile.skills.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {profile.skills.map((skill) => (
                <Badge key={skill} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          )}
        </div>
      )}

      <section className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-heading text-lg font-bold">
            {pending.length ? 'Waiting for your response' : 'Recent jobs'}
          </h2>
          <Button asChild variant="ghost" size="sm">
            <Link href="/dashboard/technician/bookings">View all</Link>
          </Button>
        </div>

        {bookings.length === 0 ? (
          <EmptyState
            title="No job yet"
            description="Add your services and set availability so customers can find you."
            icon={CalendarRange}
          >
            <Button asChild>
              <Link href="/dashboard/technician/services">Add a service</Link>
            </Button>
          </EmptyState>
        ) : (
          <div className="space-y-3">
            {(pending.length ? pending : bookings).slice(0, 4).map((booking) => (
              <TechnicianBookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
