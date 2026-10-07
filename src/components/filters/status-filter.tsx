'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';
import { cn } from '@/lib/utils';

type Props = {
  basePath: string;
  options: { value: string; label: string }[];
};

export function StatusFilter({ basePath, options }: Props) {
  const router = useRouter();
  const params = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const current = params.get('status') ?? '';

  const go = (value: string) => {
    const query = new URLSearchParams(params.toString());
    if (value) query.set('status', value);
    else query.delete('status');
    query.delete('page');
    startTransition(() => router.push(`${basePath}?${query.toString()}`));
  };

  return (
    <div
      className={cn(
        'mb-5 flex flex-wrap gap-2',
        isPending && 'pointer-events-none opacity-60',
      )}
    >
      {[{ value: '', label: 'All' }, ...options].map((option) => (
        <button
          key={option.value || 'all'}
          onClick={() => go(option.value)}
          className={cn(
            'rounded-full border px-3 py-1.5 text-sm transition-colors',
            current === option.value
              ? 'border-primary bg-primary text-primary-foreground'
              : 'hover:bg-accent',
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
