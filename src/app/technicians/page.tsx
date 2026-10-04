import type { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, SearchX, Wrench } from 'lucide-react';
import { Rating } from '@/components/rating';
import { EmptyState } from '@/components/empty-state';
import { Pagination } from '@/components/pagination';
import { TechnicianFilters } from '@/components/filters/technician-filters';
import { getTechnicians } from '@/lib/queries';
import { taka } from '@/lib/format';

export const metadata: Metadata = { title: 'Technicians' };

export default async function TechniciansPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const page = Number(params.page ?? 1);

  const res = await getTechnicians({
    search: params.search,
    city: params.city,
    minRating: params.minRating,
    sortBy: params.sortBy ?? 'avgRating',
    sortOrder: 'desc',
    page,
    limit: 12,
  });

  const technicians = res.data ?? [];
  const allCities = [...new Set(technicians.map((t) => t.city))].sort();

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="font-heading text-3xl font-bold">Our technicians</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Every technician is verified before they can take bookings.
      </p>

      <div className="mt-6">
        <TechnicianFilters cities={allCities} />
      </div>

      {!technicians.length ? (
        <EmptyState
          title="No technician found"
          description="Try a different city or clear the filters."
          icon={SearchX}
        />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {technicians.map((tech) => (
              <Link
                key={tech.id}
                href={`/technicians/${tech.id}`}
                className="rounded-xl border bg-card p-5 transition-shadow hover:shadow-md"
              >
                <div className="flex items-start gap-3">
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-accent font-heading font-bold text-accent-foreground">
                    {tech.user.name
                      .split(' ')
                      .slice(0, 2)
                      .map((p) => p[0])
                      .join('')}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-heading font-semibold">
                      {tech.user.name}
                    </p>
                    <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="size-3" />
                      {tech.serviceArea || tech.city}
                    </p>
                    <div className="mt-2">
                      <Rating value={tech.avgRating} count={tech.totalReviews} />
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t pt-3 text-sm">
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Wrench className="size-3.5" />
                    {tech.isAvailable ? 'Taking bookings' : 'Not available'}
                  </span>
                  <span className="font-medium">{taka(tech.hourlyRate)}/hr</span>
                </div>
              </Link>
            ))}
          </div>

          <Pagination
            page={res.meta?.page ?? 1}
            totalPage={res.meta?.totalPage ?? 1}
            basePath="/technicians"
          />
        </>
      )}
    </main>
  );
}
