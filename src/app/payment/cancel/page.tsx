import type { Metadata } from 'next';
import Link from 'next/link';
import { XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = { title: 'Payment cancelled' };

export default async function PaymentCancelPage({
  searchParams,
}: {
  searchParams: Promise<{ reason?: string }>;
}) {
  const { reason } = await searchParams;

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-4 py-12 text-center">
      <span className="flex size-16 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-500/15">
        <XCircle className="size-8" />
      </span>

      <h1 className="mt-5 font-heading text-2xl font-bold">
        Payment was not completed
      </h1>

      <p className="mt-2 text-sm text-muted-foreground">
        {reason ||
          'You cancelled the payment or the gateway could not process it. Your booking is still saved, you can pay again anytime.'}
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Button asChild>
          <Link href="/dashboard/customer/bookings">Back to my bookings</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/services">Browse services</Link>
        </Button>
      </div>
    </main>
  );
}
