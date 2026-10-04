'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Props = {
  page: number;
  totalPage: number;
  basePath: string;
};

export function Pagination({ page, totalPage, basePath }: Props) {
  const router = useRouter();
  const params = useSearchParams();

  if (totalPage <= 1) return null;

  const go = (next: number) => {
    const query = new URLSearchParams(params.toString());
    query.set('page', String(next));
    router.push(`${basePath}?${query.toString()}`);
  };

  return (
    <div className="mt-8 flex items-center justify-center gap-2">
      <Button
        variant="outline"
        size="sm"
        disabled={page <= 1}
        onClick={() => go(page - 1)}
      >
        <ChevronLeft className="size-4" />
        Previous
      </Button>

      <span className="px-3 text-sm text-muted-foreground">
        Page {page} of {totalPage}
      </span>

      <Button
        variant="outline"
        size="sm"
        disabled={page >= totalPage}
        onClick={() => go(page + 1)}
      >
        Next
        <ChevronRight className="size-4" />
      </Button>
    </div>
  );
}
