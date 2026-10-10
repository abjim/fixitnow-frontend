import { CalendarRange } from 'lucide-react';
import { PageHeader } from '@/components/dashboard/page-header';
import { TechnicianBookingCard } from '@/components/booking/technician-booking-card';
import { StatusFilter } from '@/components/filters/status-filter';
import { Pagination } from '@/components/pagination';
import { EmptyState } from '@/components/empty-state';
import { getTechnicianBookings } from '@/lib/queries';

const statuses = [
  { value: 'REQUESTED', label: 'New' },
  { value: 'ACCEPTED', label: 'Accepted' },
  { value: 'PAID', label: 'Paid' },
  { value: 'IN_PROGRESS', label: 'In progress' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'DECLINED', label: 'Declined' },
];

export default async function TechnicianBookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>;
}) {
  const params = await searchParams;

  const res = await getTechnicianBookings({
    status: params.status,
    page: Number(params.page ?? 1),
    limit: 10,
    sortBy: 'scheduledAt',
    sortOrder: 'desc',
  });

  const bookings = res.data ?? [];

  return (
    <>
      <PageHeader
        title="Job requests"
        description="Accept, start and complete the jobs assigned to you."
      />

      <StatusFilter basePath="/dashboard/technician/bookings" options={statuses} />

      {bookings.length === 0 ? (
        <EmptyState
          title="No job here"
          description={
            params.status
              ? 'Nothing with this status right now.'
              : 'New booking requests will show up here.'
          }
          icon={CalendarRange}
        />
      ) : (
        <>
          <div className="space-y-3">
            {bookings.map((booking) => (
              <TechnicianBookingCard key={booking.id} booking={booking} />
            ))}
          </div>

          <Pagination
            page={res.meta?.page ?? 1}
            totalPage={res.meta?.totalPage ?? 1}
            basePath="/dashboard/technician/bookings"
          />
        </>
      )}
    </>
  );
}
