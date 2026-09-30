import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

type Props = {
  value: number;
  count?: number;
  className?: string;
};

export function Rating({ value, count, className }: Props) {
  return (
    <span className={cn('inline-flex items-center gap-1 text-sm', className)}>
      <Star className="size-3.5 fill-amber-400 text-amber-400" />
      <span className="font-medium">{value > 0 ? value.toFixed(1) : 'New'}</span>
      {count !== undefined && count > 0 && (
        <span className="text-muted-foreground">({count})</span>
      )}
    </span>
  );
}
