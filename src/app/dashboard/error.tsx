'use client';

import { RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DashboardError({ reset }: { reset: () => void }) {
  return (
    <div className="rounded-xl border border-dashed p-10 text-center">
      <p className="font-heading font-semibold">This page failed to load</p>
      <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
        The request to the server did not go through. Check your internet and
        try again.
      </p>
      <Button onClick={reset} className="mt-4">
        <RotateCw className="size-4" /> Reload
      </Button>
    </div>
  );
}
