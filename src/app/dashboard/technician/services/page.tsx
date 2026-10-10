import { PageHeader } from '@/components/dashboard/page-header';
import { ServiceManager } from '@/components/dashboard/service-manager';
import { getCategories, getMyServices } from '@/lib/queries';

export default async function TechnicianServicesPage() {
  const [servicesRes, categoriesRes] = await Promise.all([
    getMyServices(),
    getCategories({ limit: 50, isActive: 'true' }),
  ]);

  return (
    <>
      <PageHeader
        title="My services"
        description="Services you offer, with price and duration."
      />
      <ServiceManager
        services={servicesRes.data ?? []}
        categories={categoriesRes.data ?? []}
      />
    </>
  );
}
