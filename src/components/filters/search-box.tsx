'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useRef, useTransition } from 'react';
import { Loader2, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

type Props = {
  basePath: string;
  placeholder?: string;
};

export function SearchBox({ basePath, placeholder }: Props) {
  const router = useRouter();
  const params = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const search = params.get('search') ?? '';
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onSearch = (value: string) => {
    if (timer.current) clearTimeout(timer.current);

    timer.current = setTimeout(() => {
      const query = new URLSearchParams(params.toString());
      if (value) query.set('search', value);
      else query.delete('search');
      query.delete('page');
      startTransition(() => router.push(`${basePath}?${query.toString()}`));
    }, 450);
  };

  return (
    <div className="relative mb-5 sm:max-w-sm">
      <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        key={search}
        defaultValue={search}
        onChange={(e) => onSearch(e.target.value)}
        placeholder={placeholder ?? 'Search...'}
        className="pl-9"
      />
      {isPending && (
        <Loader2 className="absolute right-3 top-1/2 size-4 -translate-y-1/2 animate-spin text-muted-foreground" />
      )}
    </div>
  );
}
