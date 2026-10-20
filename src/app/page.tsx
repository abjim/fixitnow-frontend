import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import {
  ArrowRight,
  BadgeCheck,
  CalendarCheck,
  CreditCard,
  Search,
  ShieldCheck,
  Star,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ServiceCard } from '@/components/service-card';
import { Rating } from '@/components/rating';
import { getCategories, getServices, getTechnicians } from '@/lib/queries';
import { categoryImage, heroImage } from '@/lib/images';
import { taka } from '@/lib/format';

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Categories />
      <Suspense fallback={<FeaturedSkeleton />}>
        <FeaturedServices />
      </Suspense>
      <HowItWorks />
      <Suspense fallback={null}>
        <TopTechnicians />
      </Suspense>
    </main>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden border-b">
      <div className="hero-grid absolute inset-0 opacity-60" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 lg:grid-cols-2 lg:py-20">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full border bg-background px-3 py-1 text-xs font-medium">
            <BadgeCheck className="size-3.5 text-primary" />
            Verified technicians across Dhaka &amp; Chattogram
          </span>

          <h1 className="mt-5 font-heading text-4xl font-extrabold leading-[1.1] sm:text-5xl">
            Home repairs,
            <br />
            sorted in a few taps.
          </h1>

          <p className="mt-4 max-w-md text-muted-foreground">
            Plumbing, electrical, cleaning or AC work. Compare real ratings,
            pick a time that suits you and pay online after the job is accepted.
          </p>

          <form
            action="/services"
            className="mt-7 flex max-w-md items-center gap-2 rounded-lg border bg-card p-1.5 shadow-sm"
          >
            <Search className="ml-2 size-4 shrink-0 text-muted-foreground" />
            <input
              name="search"
              placeholder="What do you need fixed?"
              className="h-9 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            <Button type="submit" size="sm">
              Search
            </Button>
          </form>

          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="size-4 text-primary" /> Pay only after acceptance
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CalendarCheck className="size-4 text-primary" /> Pick your own slot
            </span>
          </div>
        </div>

        <div className="relative hidden lg:block">
          <div className="relative aspect-[5/6] overflow-hidden rounded-2xl border shadow-sm">
            <Image
              src={heroImage}
              alt="Technician repairing a pipe"
              fill
              priority
              sizes="500px"
              className="object-cover"
            />
          </div>
          <div className="absolute -bottom-5 -left-6 rounded-xl border bg-card p-4 shadow-md">
            <p className="text-xs text-muted-foreground">Average rating</p>
            <div className="mt-0.5 flex items-center gap-2">
              <span className="font-heading text-2xl font-bold">4.8</span>
              <span className="flex">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="size-3.5 fill-amber-400 text-amber-400" />
                ))}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

async function Categories() {
  const res = await getCategories({ limit: 6, isActive: 'true' });
  const categories = res.data ?? [];

  if (!categories.length) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <h2 className="font-heading text-2xl font-bold">Browse by category</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Pick a category to see technicians available near you.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/services?category=${category.slug}`}
            className="group relative aspect-[4/3] overflow-hidden rounded-lg border"
          >
            <Image
              src={categoryImage(category.slug, 300, 220)}
              alt={category.name}
              fill
              sizes="(max-width: 640px) 50vw, 16vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <span className="absolute inset-0 bg-gradient-to-t from-black/75 to-black/10" />
            <span className="absolute inset-x-0 bottom-0 p-2.5 text-sm font-semibold text-white">
              {category.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

async function FeaturedServices() {
  const res = await getServices({ limit: 6, sortBy: 'rating', sortOrder: 'desc' });
  const services = res.data ?? [];

  if (!services.length) return null;

  return (
    <section className="border-y bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="font-heading text-2xl font-bold">Popular services</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Highest rated work from our technicians this month.
            </p>
          </div>
          <Button asChild variant="ghost" className="hidden sm:flex">
            <Link href="/services">
              View all <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>

        <Button asChild variant="outline" className="mt-6 w-full sm:hidden">
          <Link href="/services">View all services</Link>
        </Button>
      </div>
    </section>
  );
}

function FeaturedSkeleton() {
  return (
    <section className="border-y bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <Skeleton className="h-7 w-48" />
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-72 rounded-xl" />
          ))}
        </div>
      </div>
    </section>
  );
}

const steps = [
  {
    icon: Search,
    title: 'Find a technician',
    body: 'Filter by category, city, price or rating and open the profile you like.',
  },
  {
    icon: CalendarCheck,
    title: 'Book a slot',
    body: 'Choose a date and time inside the technician working hours.',
  },
  {
    icon: CreditCard,
    title: 'Pay after accept',
    body: 'Once the technician accepts, pay securely with card or mobile banking.',
  },
];

function HowItWorks() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-14">
      <h2 className="font-heading text-2xl font-bold">How it works</h2>
      <div className="mt-6 grid gap-5 sm:grid-cols-3">
        {steps.map((step, index) => (
          <div key={step.title} className="rounded-xl border bg-card p-5">
            <div className="flex items-center gap-3">
              <span className="flex size-9 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                <step.icon className="size-4" />
              </span>
              <span className="text-xs font-semibold text-muted-foreground">
                STEP {index + 1}
              </span>
            </div>
            <p className="mt-3 font-heading font-semibold">{step.title}</p>
            <p className="mt-1 text-sm text-muted-foreground">{step.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

async function TopTechnicians() {
  const res = await getTechnicians({
    limit: 4,
    sortBy: 'avgRating',
    sortOrder: 'desc',
  });
  const technicians = res.data ?? [];

  if (!technicians.length) return null;

  return (
    <section className="border-t bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-heading text-2xl font-bold">Top rated technicians</h2>
          <Button asChild variant="ghost" className="hidden sm:flex">
            <Link href="/technicians">
              See all <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {technicians.map((tech) => (
            <Link
              key={tech.id}
              href={`/technicians/${tech.id}`}
              className="rounded-xl border bg-card p-4 transition-shadow hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <span className="flex size-11 items-center justify-center rounded-full bg-accent font-heading text-sm font-bold text-accent-foreground">
                  {tech.user.name
                    .split(' ')
                    .slice(0, 2)
                    .map((p) => p[0])
                    .join('')}
                </span>
                <div className="min-w-0">
                  <p className="truncate font-medium">{tech.user.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {tech.city}
                  </p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between border-t pt-3">
                <Rating value={tech.avgRating} count={tech.totalReviews} />
                <span className="text-sm text-muted-foreground">
                  {taka(tech.hourlyRate)}/hr
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
