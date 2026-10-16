import Link from 'next/link';
import {
  CalendarRange,
  FolderTree,
  UserRound,
  Wallet,
  Wrench,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader, StatCard } from '@/components/dashboard/page-header';
import { BookingBadge } from '@/components/status-badge';
import { EmptyState } from '@/components/empty-state';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getAdminStats } from '@/lib/queries';
import { dateOnly, taka } from '@/lib/format';
import type { BookingStatus } from '@/lib/types';

const statusOrder: BookingStatus[] = [
  'REQUESTED',
  'ACCEPTED',
  'PAID',
  'IN_PROGRESS',
  'COMPLETED',
  'CANCELLED',
  'DECLINED',
];

export default async function AdminOverviewPage() {
  const res = await getAdminStats();
  const stats = res.data;

  if (!stats) {
    return (
      <>
        <PageHeader title="Admin dashboard" />
        <EmptyState title="Could not load the stats" description={res.message} />
      </>
    );
  }

  const counts = new Map(stats.bookings.byStatus.map((row) => [row.status, row.count]));

  return (
    <>
      <PageHeader
        title="Admin dashboard"
        description="Platform numbers at one place."
        action={
          <Button asChild variant="outline">
            <Link href="/dashboard/admin/categories">Manage categories</Link>
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Customers"
          value={stats.users.customers}
          icon={UserRound}
          hint={stats.users.banned ? `${stats.users.banned} banned` : undefined}
        />
        <StatCard label="Technicians" value={stats.users.technicians} icon={Wrench} />
        <StatCard
          label="Total bookings"
          value={stats.bookings.total}
          icon={CalendarRange}
        />
        <StatCard
          label="Revenue"
          value={taka(stats.revenue.totalPaid)}
          icon={Wallet}
          hint={`${stats.revenue.paidCount} paid bookings`}
        />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        <div className="rounded-xl border bg-card p-5 lg:col-span-2">
          <h2 className="font-heading font-semibold">Bookings by status</h2>

          <div className="mt-4 space-y-3">
            {statusOrder.map((status) => {
              const count = counts.get(status) ?? 0;
              const width = stats.bookings.total
                ? (count / stats.bookings.total) * 100
                : 0;

              return (
                <div key={status}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <BookingBadge status={status} />
                    <span className="text-muted-foreground">{count}</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${width}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <StatCard
            label="Categories"
            value={stats.catalog.categories}
            icon={FolderTree}
          />
          <StatCard label="Services" value={stats.catalog.services} icon={Wrench} />

          <div className="rounded-xl border bg-card p-4">
            <p className="text-sm text-muted-foreground">Banned accounts</p>
            <p className="mt-2 font-heading text-2xl font-bold">
              {stats.users.banned}
            </p>
            <Button asChild variant="ghost" size="sm" className="mt-2 -ml-2">
              <Link href="/dashboard/admin/users?status=BANNED">See the list</Link>
            </Button>
          </div>
        </div>
      </div>

      <section className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-heading text-lg font-bold">Latest bookings</h2>
          <Button asChild variant="ghost" size="sm">
            <Link href="/dashboard/admin/bookings">View all</Link>
          </Button>
        </div>

        {stats.recentBookings.length === 0 ? (
          <EmptyState title="No booking yet" icon={CalendarRange} />
        ) : (
          <div className="overflow-x-auto rounded-xl border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.recentBookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-medium">
                      {booking.customer.name}
                    </TableCell>
                    <TableCell>{booking.service.title}</TableCell>
                    <TableCell className="whitespace-nowrap text-muted-foreground">
                      {dateOnly(booking.createdAt)}
                    </TableCell>
                    <TableCell>
                      <BookingBadge status={booking.status} />
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {taka(booking.price)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </section>
    </>
  );
}
