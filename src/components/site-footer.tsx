'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Wrench } from 'lucide-react';

export function SiteFooter() {
  const pathname = usePathname();

  if (pathname.startsWith('/dashboard')) return null;

  return (
    <footer className="mt-16 border-t bg-muted/40">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Wrench className="size-4" />
            </span>
            <span className="font-heading text-lg font-bold">FixItNow</span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            Book verified technicians for plumbing, electrical, cleaning and AC
            work across Bangladesh.
          </p>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold">Services</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <Link href="/services?category=plumbing" className="hover:text-foreground">
                Plumbing
              </Link>
            </li>
            <li>
              <Link href="/services?category=electrical" className="hover:text-foreground">
                Electrical
              </Link>
            </li>
            <li>
              <Link href="/services?category=cleaning" className="hover:text-foreground">
                Cleaning
              </Link>
            </li>
            <li>
              <Link href="/services?category=ac-repair" className="hover:text-foreground">
                AC Repair
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold">Company</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <Link href="/services" className="hover:text-foreground">
                Browse services
              </Link>
            </li>
            <li>
              <Link href="/technicians" className="hover:text-foreground">
                Our technicians
              </Link>
            </li>
            <li>
              <Link href="/register" className="hover:text-foreground">
                Join as technician
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold">Support</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>support@fixitnow.com</li>
            <li>+880 1700 000000</li>
            <li>Dhaka, Bangladesh</li>
          </ul>
        </div>
      </div>

      <div className="border-t py-4">
        <p className="text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} FixItNow. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
