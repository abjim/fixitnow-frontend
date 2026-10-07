import { CalendarRange } from 'lucide-react';
import { PageHeader } from '@/components/dashboard/page-header';
import { CustomerBookingCard } from '@/components/booking/customer-booking-card';
import { StatusFilter } from '@/components/filters/status-filter';
import { Pagination } from '@/components/pagination';
import { EmptyState } from '@/components/empty-state';
import { getMyBookings } from '@/lib/queries';

const statuses = [
  { value: 'REQUESTED', label: 'Requested' },
  { value: 'ACCEPTED', label: 'Accepted' },
  { value: 'PAID', label: 'Paid' },
  { value: 'IN_PROGRESS', label: 'In progress' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

export default async function CustomerBookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>;
}) {
  const params = await searchParams;

  const res = await getMyBookings({
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
        title="My bookings"
        description="Track every job from request to completion."
      />

      <StatusFilter basePath="/dashboard/customer/bookings" options={statuses} />

      {bookings.length === 0 ? (
        <EmptyState
          title="Nothing here"
          description={
            params.status
              ? 'No booking with this status.'
              : 'You have not booked any service yet.'
          }
          icon={CalendarRange}
        />
      ) : (
        <>
          <div className="space-y-3">
            {bookings.map((booking) => (
              <CustomerBookingCard key={booking.id} booking={booking} />
            ))}
          </div>

          <Pagination
            page={res.meta?.page ?? 1}
            totalPage={res.meta?.totalPage ?? 1}
            basePath="/dashboard/customer/bookings"
          />
        </>
      )}
    </>
  );
}
