import { PageHeader } from '@/components/dashboard/page-header';
import { AvailabilityEditor } from '@/components/dashboard/availability-editor';
import { getMyAvailability } from '@/lib/queries';

export default async function AvailabilityPage() {
  const res = await getMyAvailability();

  return (
    <>
      <PageHeader
        title="Availability"
        description="Set the weekly hours when you can take jobs."
      />
      <AvailabilityEditor initial={res.data ?? []} />
    </>
  );
}
