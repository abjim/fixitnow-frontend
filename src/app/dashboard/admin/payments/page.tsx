import { Receipt } from 'lucide-react';
import { PageHeader, StatCard } from '@/components/dashboard/page-header';
import { PaymentBadge } from '@/components/status-badge';
import { StatusFilter } from '@/components/filters/status-filter';
import { Pagination } from '@/components/pagination';
import { EmptyState } from '@/components/empty-state';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getAdminPayments } from '@/lib/queries';
import { dateTime, taka } from '@/lib/format';

const statuses = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'FAILED', label: 'Failed' },
];

export default async function AdminPaymentsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>;
}) {
  const params = await searchParams;

  const res = await getAdminPayments({
    status: params.status,
    page: Number(params.page ?? 1),
    limit: 15,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const payments = res.data ?? [];

  // FIXME: only the current page is summed up, backend does not give a total
  const onThisPage = payments
    .filter((p) => p.status === 'COMPLETED')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <>
      <PageHeader
        title="Payments"
        description={`${res.meta?.total ?? 0} transactions recorded.`}
      />

      <div className="mb-5 grid gap-4 sm:grid-cols-3">
        <StatCard label="Transactions" value={res.meta?.total ?? 0} icon={Receipt} />
        <StatCard label="Collected on this page" value={taka(onThisPage)} />
        <StatCard
          label="Failed on this page"
          value={payments.filter((p) => p.status === 'FAILED').length}
        />
      </div>

      <StatusFilter basePath="/dashboard/admin/payments" options={statuses} />

      {payments.length === 0 ? (
        <EmptyState
          title="No payment"
          description="Nothing matched this filter."
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
                  <TableHead>Technician</TableHead>
                  <TableHead>Gateway</TableHead>
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
                    <TableCell>{payment.booking?.service.title ?? '-'}</TableCell>
                    <TableCell>
                      {payment.booking?.technician.user.name ?? '-'}
                    </TableCell>
                    <TableCell>
                      {payment.provider === 'SSLCOMMERZ' ? 'SSLCommerz' : 'Stripe'}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-muted-foreground">
                      {dateTime(payment.paidAt ?? payment.createdAt)}
                    </TableCell>
                    <TableCell>
                      <PaymentBadge status={payment.status} />
                      {payment.failReason && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          {payment.failReason}
                        </p>
                      )}
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
            basePath="/dashboard/admin/payments"
          />
        </>
      )}
    </>
  );
}
