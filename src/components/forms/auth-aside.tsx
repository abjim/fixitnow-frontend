import Image from 'next/image';
import { heroImage } from '@/lib/images';

export function AuthAside() {
  return (
    <div className="relative hidden lg:block">
      <Image
        src={heroImage}
        alt=""
        fill
        sizes="50vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
      <div className="absolute inset-x-0 bottom-0 p-10 text-white">
        <p className="font-heading text-2xl font-bold">
          Book a technician, not a headache.
        </p>
        <p className="mt-2 max-w-sm text-sm text-white/80">
          Track every booking from request to payment in one dashboard.
        </p>
      </div>
    </div>
  );
}
