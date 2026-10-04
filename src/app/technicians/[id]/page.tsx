import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { BadgeCheck, Briefcase, MapPin, Star } from 'lucide-react';
import { Rating } from '@/components/rating';
import { BookService } from '@/components/booking/book-service';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { getTechnician } from '@/lib/queries';
import { getCurrentUser } from '@/lib/session';
import { categoryImage } from '@/lib/images';
import { DAY_SHORT, dateOnly, duration, taka } from '@/lib/format';

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ service?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const res = await getTechnician(id);
  if (!res.success) return { title: 'Technician' };
  return { title: res.data.user.name };
}

export default async function TechnicianPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { service } = await searchParams;

  const [res, user] = await Promise.all([getTechnician(id), getCurrentUser()]);

  if (!res.success || !res.data) notFound();

  const tech = res.data;

  // group working hours so we can show them as Sun-Thu style rows
  const byDay = new Map<number, string[]>();
  for (const slot of tech.availabilities) {
    const list = byDay.get(slot.dayOfWeek) ?? [];
    list.push(`${slot.startTime} - ${slot.endTime}`);
    byDay.set(slot.dayOfWeek, list);
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <div>
          <div className="flex flex-wrap items-start gap-4 rounded-xl border bg-card p-6">
            <span className="flex size-16 items-center justify-center rounded-full bg-accent font-heading text-xl font-bold text-accent-foreground">
              {tech.user.name
                .split(' ')
                .slice(0, 2)
                .map((p) => p[0])
                .join('')}
            </span>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-heading text-2xl font-bold">
                  {tech.user.name}
                </h1>
                {tech.user.status === 'ACTIVE' && (
                  <BadgeCheck className="size-5 text-primary" />
                )}
              </div>

              <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="size-3.5" />
                  {tech.serviceArea || tech.city}
                </span>
                <span className="flex items-center gap-1">
                  <Briefcase className="size-3.5" />
                  {tech.experienceYears} years experience
                </span>
                <Rating value={tech.avgRating} count={tech.totalReviews} />
              </div>

              {tech.bio && (
                <p className="mt-3 text-sm text-muted-foreground">{tech.bio}</p>
              )}

              {tech.skills.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {tech.skills.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="text-right">
              <p className="text-xs text-muted-foreground">Hourly rate</p>
              <p className="font-heading text-xl font-bold">
                {taka(tech.hourlyRate)}
              </p>
            </div>
          </div>

          <section className="mt-8">
            <h2 className="font-heading text-xl font-bold">
              Services ({tech.services.length})
            </h2>

            {tech.services.length === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">
                No service added yet.
              </p>
            ) : (
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {tech.services.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3 overflow-hidden rounded-xl border bg-card p-3"
                  >
                    <div className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-muted">
                      <Image
                        src={categoryImage(item.category.slug, 200, 200)}
                        alt={item.category.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium leading-snug">{item.title}</p>
                      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                        {item.description}
                      </p>
                      <p className="mt-1.5 text-sm">
                        <span className="font-semibold">{taka(item.price)}</span>
                        <span className="text-muted-foreground">
                          {' '}
                          · {duration(item.durationMinutes)}
                        </span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="mt-8">
            <h2 className="font-heading text-xl font-bold">Working hours</h2>
            {byDay.size === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">
                Working hours are not set yet.
              </p>
            ) : (
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {[...byDay.entries()]
                  .sort((a, b) => a[0] - b[0])
                  .map(([day, ranges]) => (
                    <div
                      key={day}
                      className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm"
                    >
                      <span className="font-medium">{DAY_SHORT[day]}</span>
                      <span className="text-muted-foreground">
                        {ranges.join(', ')}
                      </span>
                    </div>
                  ))}
              </div>
            )}
          </section>

          <Separator className="my-8" />

          <section>
            <h2 className="font-heading text-xl font-bold">
              Reviews ({tech.totalReviews})
            </h2>

            {tech.reviews.length === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">
                No review yet. Be the first one to book and review.
              </p>
            ) : (
              <div className="mt-4 space-y-4">
                {tech.reviews.map((review) => (
                  <div key={review.id} className="rounded-xl border bg-card p-4">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">
                        {review.customer?.name ?? 'Customer'}
                      </p>
                      <span className="text-xs text-muted-foreground">
                        {dateOnly(review.createdAt)}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={
                            i < review.rating
                              ? 'size-3.5 fill-amber-400 text-amber-400'
                              : 'size-3.5 text-muted-foreground/40'
                          }
                        />
                      ))}
                    </div>
                    {review.comment && (
                      <p className="mt-2 text-sm text-muted-foreground">
                        {review.comment}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        <div className="lg:sticky lg:top-20 lg:self-start">
          <BookService
            technicianId={tech.id}
            services={tech.services}
            availabilities={tech.availabilities}
            defaultServiceId={service}
            isLoggedIn={Boolean(user)}
            isCustomer={user?.role === 'CUSTOMER'}
            acceptingBookings={tech.isAvailable}
          />
        </div>
      </div>
    </main>
  );
}
