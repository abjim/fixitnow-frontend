import { Receipt } from 'lucide-react';
import { PageHeader } from '@/components/dashboard/page-header';
import { PaymentBadge } from '@/components/status-badge';
import { EmptyState } from '@/components/empty-state';
import { Pagination } from '@/components/pagination';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getMyPayments } from '@/lib/queries';
import { dateOnly, taka } from '@/lib/format';

export default async function CustomerPaymentsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const res = await getMyPayments({
    page: Number(params.page ?? 1),
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const payments = res.data ?? [];

  return (
    <>
      <PageHeader
        title="Payment history"
        description="Every payment you made for your bookings."
      />

      {payments.length === 0 ? (
        <EmptyState
          title="No payment yet"
          description="Payments will show up here once you pay for a booking."
          icon={Receipt}
        />
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-mono text-xs">
                      {payment.transactionId}
                    </TableCell>
                    <TableCell>
                      {payment.booking?.service.title ?? '-'}
                    </TableCell>
                    <TableCell>
                      {payment.provider === 'SSLCOMMERZ' ? 'SSLCommerz' : 'Stripe'}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {dateOnly(payment.paidAt ?? payment.createdAt)}
                    </TableCell>
                    <TableCell>
                      <PaymentBadge status={payment.status} />
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {taka(payment.amount)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <Pagination
            page={res.meta?.page ?? 1}
            totalPage={res.meta?.totalPage ?? 1}
            basePath="/dashboard/customer/payments"
          />
        </>
      )}
    </>
  );
}
