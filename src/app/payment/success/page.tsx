import type { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PaymentBadge } from '@/components/status-badge';
import { VerifyPayment } from '@/components/booking/verify-payment';
import { getMyPayments } from '@/lib/queries';
import { dateTime, taka } from '@/lib/format';

export const metadata: Metadata = { title: 'Payment successful' };

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ transactionId?: string; tran_id?: string }>;
}) {
  const params = await searchParams;
  const transactionId = params.transactionId ?? params.tran_id;

  const res = await getMyPayments({ limit: 50 });
  const payment = (res.data ?? []).find(
    (item) => item.transactionId === transactionId,
  );

  const done = payment?.status === 'COMPLETED';

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-4 py-12 text-center">
      <span
        className={
          done
            ? 'flex size-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15'
            : 'flex size-16 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-500/15'
        }
      >
        {done ? (
          <CheckCircle2 className="size-8" />
        ) : (
          <Clock className="size-8" />
        )}
      </span>

      <h1 className="mt-5 font-heading text-2xl font-bold">
        {done ? 'Payment successful' : 'Payment is being confirmed'}
      </h1>

      <p className="mt-2 text-sm text-muted-foreground">
        {done
          ? 'Your booking is confirmed. The technician will start the job on the scheduled time.'
          : 'We have not received the confirmation from the gateway yet. Check again in a moment.'}
      </p>

      {payment && (
        <div className="mt-6 w-full rounded-xl border bg-card p-5 text-left">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Status</span>
            <PaymentBadge status={payment.status} />
          </div>

          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Transaction</dt>
              <dd className="font-mono text-xs">{payment.transactionId}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Service</dt>
              <dd>{payment.booking?.service.title ?? '-'}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Method</dt>
              <dd>
                {payment.provider === 'SSLCOMMERZ' ? 'SSLCommerz' : 'Stripe'}
              </dd>
            </div>
            {payment.paidAt && (
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Paid at</dt>
                <dd>{dateTime(payment.paidAt)}</dd>
              </div>
            )}
            <div className="flex justify-between gap-4 border-t pt-2">
              <dt className="font-medium">Amount</dt>
              <dd className="font-heading text-base font-bold">
                {taka(payment.amount)}
              </dd>
            </div>
          </dl>
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Button asChild>
          <Link href="/dashboard/customer/bookings">Go to my bookings</Link>
        </Button>
        {!done && transactionId && <VerifyPayment transactionId={transactionId} />}
      </div>
    </main>
  );
}
