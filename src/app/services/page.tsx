import type { Metadata } from 'next';
import { Suspense } from 'react';
import { SearchX } from 'lucide-react';
import { ServiceCard } from '@/components/service-card';
import { ServiceFilters } from '@/components/filters/service-filters';
import { Pagination } from '@/components/pagination';
import { EmptyState } from '@/components/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import { getCategories, getServices, getTechnicians } from '@/lib/queries';

export const metadata: Metadata = { title: 'Browse services' };

type SearchParams = Promise<Record<string, string | undefined>>;

export default async function ServicesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const [categoriesRes, techniciansRes] = await Promise.all([
    getCategories({ limit: 50 }),
    getTechnicians({ limit: 50 }),
  ]);

  const cities = [...new Set((techniciansRes.data ?? []).map((t) => t.city))].sort();

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="font-heading text-3xl font-bold">Browse services</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Filter by category, city, price or rating to find the right technician.
      </p>

      <div className="mt-6">
        <ServiceFilters categories={categoriesRes.data ?? []} cities={cities} />
      </div>

      <Suspense key={JSON.stringify(params)} fallback={<ResultsSkeleton />}>
        <Results params={params} />
      </Suspense>
    </main>
  );
}

async function Results({ params }: { params: Record<string, string | undefined> }) {
  const page = Number(params.page ?? 1);

  const res = await getServices({
    search: params.search,
    category: params.category,
    city: params.city,
    minPrice: params.minPrice,
    maxPrice: params.maxPrice,
    minRating: params.minRating,
    sortBy: params.sortBy ?? 'rating',
    sortOrder: params.sortOrder ?? 'desc',
    page,
    limit: 9,
  });

  if (!res.success) {
    return (
      <EmptyState
        title="Could not load services"
        description={res.message}
        icon={SearchX}
      />
    );
  }

  const services = res.data ?? [];

  if (!services.length) {
    return (
      <EmptyState
        title="No services found"
        description="Try changing the filters or search with a different word."
        icon={SearchX}
      />
    );
  }

  return (
    <>
      <p className="mb-4 text-sm text-muted-foreground">
        {res.meta?.total ?? services.length} service
        {(res.meta?.total ?? 0) === 1 ? '' : 's'} found
      </p>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>

      <Pagination
        page={res.meta?.page ?? 1}
        totalPage={res.meta?.totalPage ?? 1}
        basePath="/services"
      />
    </>
  );
}

function ResultsSkeleton() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-xl border">
          <Skeleton className="aspect-[3/2] rounded-none" />
          <div className="space-y-2 p-4">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}
