import { cn } from '@/lib/utils';
import type { BookingStatus, PaymentStatus } from '@/lib/types';

const bookingStyles: Record<BookingStatus, string> = {
  REQUESTED: 'bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300',
  ACCEPTED: 'bg-blue-100 text-blue-800 dark:bg-blue-500/15 dark:text-blue-300',
  DECLINED: 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300',
  PAID: 'bg-violet-100 text-violet-800 dark:bg-violet-500/15 dark:text-violet-300',
  IN_PROGRESS: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300',
  COMPLETED: 'bg-slate-200 text-slate-700 dark:bg-slate-500/20 dark:text-slate-300',
  CANCELLED: 'bg-rose-200 text-rose-900 dark:bg-rose-500/20 dark:text-rose-300',
};

const bookingLabels: Record<BookingStatus, string> = {
  REQUESTED: 'Requested',
  ACCEPTED: 'Accepted',
  DECLINED: 'Declined',
  PAID: 'Paid',
  IN_PROGRESS: 'In progress',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
};

const paymentStyles: Record<PaymentStatus, string> = {
  PENDING: 'bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300',
  COMPLETED: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300',
  FAILED: 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300',
};

const base =
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap';

export function BookingBadge({ status }: { status: BookingStatus }) {
  return <span className={cn(base, bookingStyles[status])}>{bookingLabels[status]}</span>;
}

export function PaymentBadge({ status }: { status: PaymentStatus }) {
  return (
    <span className={cn(base, paymentStyles[status])}>
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  );
}
