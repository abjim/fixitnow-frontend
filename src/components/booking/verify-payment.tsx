'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { Loader2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { confirmPaymentAction } from '@/actions/payment';

export function VerifyPayment({ transactionId }: { transactionId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const verify = () => {
    startTransition(async () => {
      const result = await confirmPaymentAction(transactionId);
      if (result.ok) {
        toast.success('Payment confirmed');
        router.refresh();
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <Button variant="outline" onClick={verify} disabled={isPending}>
      {isPending ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <RefreshCw className="size-4" />
      )}
      Check payment status
    </Button>
  );
}
