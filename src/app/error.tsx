'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { RotateCw, TriangleAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <span className="mb-4 flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <TriangleAlert className="size-6" />
      </span>

      <h1 className="font-heading text-2xl font-bold">Something broke</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        We could not load this page. It may be a temporary problem with the
        server, please try once more.
      </p>

      <div className="mt-6 flex gap-2">
        <Button onClick={reset}>
          <RotateCw className="size-4" /> Try again
        </Button>
        <Button asChild variant="outline">
          <Link href="/">Go home</Link>
        </Button>
      </div>
    </div>
  );
}
