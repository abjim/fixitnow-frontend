import Image from 'next/image';
import Link from 'next/link';
import { Clock, MapPin } from 'lucide-react';
import { Rating } from '@/components/rating';
import { categoryImage } from '@/lib/images';
import { duration, taka } from '@/lib/format';
import type { Service } from '@/lib/types';

export function ServiceCard({ service }: { service: Service }) {
  return (
    <Link
      href={`/technicians/${service.technician.id}?service=${service.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border bg-card transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-[3/2] overflow-hidden bg-muted">
        <Image
          src={categoryImage(service.category.slug)}
          alt={service.category.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-background/90 px-2.5 py-1 text-xs font-medium backdrop-blur">
          {service.category.name}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-heading text-base font-semibold leading-snug">
            {service.title}
          </h3>
          <Rating value={service.technician.avgRating} />
        </div>

        <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">
          {service.description}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <MapPin className="size-3.5" />
            {service.technician.city}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="size-3.5" />
            {duration(service.durationMinutes)}
          </span>
        </div>

        <div className="mt-4 flex items-end justify-between border-t pt-3">
          <div>
            <p className="text-xs text-muted-foreground">Starts from</p>
            <p className="font-heading text-lg font-bold">{taka(service.price)}</p>
          </div>
          <p className="text-sm text-muted-foreground">
            by {service.technician.user.name}
          </p>
        </div>
      </div>
    </Link>
  );
}
