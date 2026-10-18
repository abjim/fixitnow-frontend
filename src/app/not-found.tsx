import Link from 'next/link';
import { SearchX } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <span className="mb-4 flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <SearchX className="size-6" />
      </span>

      <p className="font-heading text-4xl font-bold">404</p>
      <h1 className="mt-2 font-heading text-xl font-bold">Page not found</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        The link you followed may be broken or the page has been removed.
      </p>

      <div className="mt-6 flex gap-2">
        <Button asChild>
          <Link href="/services">Browse services</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/">Go home</Link>
        </Button>
      </div>
    </div>
  );
}
