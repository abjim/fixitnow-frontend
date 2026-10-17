import Link from 'next/link';
import { CalendarRange } from 'lucide-react';
import { PageHeader } from '@/components/dashboard/page-header';
import { SearchBox } from '@/components/filters/search-box';
import { StatusFilter } from '@/components/filters/status-filter';
import { BookingBadge, PaymentBadge } from '@/components/status-badge';
import { Pagination } from '@/components/pagination';
import { EmptyState } from '@/components/empty-state';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getAdminBookings } from '@/lib/queries';
import { dateTime, taka } from '@/lib/format';

const statuses = [
  { value: 'REQUESTED', label: 'Requested' },
  { value: 'ACCEPTED', label: 'Accepted' },
  { value: 'PAID', label: 'Paid' },
  { value: 'IN_PROGRESS', label: 'In progress' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'CANCELLED', label: 'Cancelled' },
  { value: 'DECLINED', label: 'Declined' },
];

export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; status?: string; page?: string }>;
}) {
  const params = await searchParams;

  const res = await getAdminBookings({
    search: params.search,
    status: params.status,
    page: Number(params.page ?? 1),
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const bookings = res.data ?? [];

  return (
    <>
      <PageHeader
        title="All bookings"
        description={`${res.meta?.total ?? 0} bookings in total.`}
      />

      <SearchBox
        basePath="/dashboard/admin/bookings"
        placeholder="Search customer or service..."
      />
      <StatusFilter basePath="/dashboard/admin/bookings" options={statuses} />

      {bookings.length === 0 ? (
        <EmptyState
          title="Nothing to show"
          description="No booking matched this filter."
          icon={CalendarRange}
        />
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Technician</TableHead>
                  <TableHead>Schedule</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-medium">
                      {booking.service.title}
                    </TableCell>
                    <TableCell>
                      <p>{booking.customer.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {booking.customer.email}
                      </p>
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/technicians/${booking.technician.id}`}
                        className="underline underline-offset-2"
                      >
                        {booking.technician.user.name}
                      </Link>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-muted-foreground">
                      {dateTime(booking.scheduledAt)}
                    </TableCell>
                    <TableCell>
                      <BookingBadge status={booking.status} />
                    </TableCell>
                    <TableCell>
                      {booking.payment ? (
                        <PaymentBadge status={booking.payment.status} />
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          Not paid
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {taka(booking.price)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <Pagination
            page={res.meta?.page ?? 1}
            totalPage={res.meta?.totalPage ?? 1}
            basePath="/dashboard/admin/bookings"
          />
        </>
      )}
    </>
  );
}
