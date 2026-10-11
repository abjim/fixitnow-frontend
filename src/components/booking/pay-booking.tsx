'use client';

import { useState, useTransition } from 'react';
import { CreditCard, Loader2, Smartphone } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { startPaymentAction } from '@/actions/payment';
import { cn } from '@/lib/utils';
import type { PaymentProvider } from '@/lib/types';

const providers: {
  value: PaymentProvider;
  label: string;
  hint: string;
  icon: typeof CreditCard;
}[] = [
  {
    value: 'SSLCOMMERZ',
    label: 'SSLCommerz',
    hint: 'bKash, Nagad, card or net banking',
    icon: Smartphone,
  },
  {
    value: 'STRIPE',
    label: 'Stripe',
    hint: 'International card payment',
    icon: CreditCard,
  },
];

export function PayBooking({ bookingId }: { bookingId: string }) {
  const [provider, setProvider] = useState<PaymentProvider>('SSLCOMMERZ');
  const [isPending, startTransition] = useTransition();

  const pay = () => {
    startTransition(async () => {
      const result = await startPaymentAction(bookingId, provider);

      if (!result.ok || !result.paymentUrl) {
        toast.error(result.message);
        return;
      }

      // leave the app and finish payment on the gateway page
      window.location.href = result.paymentUrl;
    });
  };

  return (
    <div className="rounded-xl border bg-card p-5">
      <p className="font-heading font-semibold">Choose payment method</p>

      <div className="mt-4 space-y-2">
        {providers.map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => setProvider(item.value)}
            className={cn(
              'flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-colors',
              provider === item.value
                ? 'border-primary bg-accent'
                : 'hover:bg-muted',
            )}
          >
            <item.icon className="size-5 shrink-0" />
            <span className="min-w-0">
              <span className="block text-sm font-medium">{item.label}</span>
              <span className="block text-xs text-muted-foreground">
                {item.hint}
              </span>
            </span>
          </button>
        ))}
      </div>

      <Button className="mt-5 w-full" onClick={pay} disabled={isPending}>
        {isPending && <Loader2 className="size-4 animate-spin" />}
        {isPending ? 'Redirecting...' : 'Continue to payment'}
      </Button>

      <p className="mt-3 text-center text-xs text-muted-foreground">
        You will be redirected to the secure gateway page.
      </p>
    </div>
  );
}
