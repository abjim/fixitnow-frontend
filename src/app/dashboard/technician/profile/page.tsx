import { PageHeader } from '@/components/dashboard/page-header';
import { TechnicianProfileForm } from '@/components/forms/technician-profile-form';
import { EmptyState } from '@/components/empty-state';
import { getTechnicianProfile } from '@/lib/queries';

export default async function TechnicianProfilePage() {
  const res = await getTechnicianProfile();

  if (!res.success || !res.data) {
    return (
      <>
        <PageHeader title="Profile" />
        <EmptyState title="Could not load profile" description={res.message} />
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Profile"
        description="This is what customers see on your public page."
      />
      <TechnicianProfileForm profile={res.data} />
    </>
  );
}
