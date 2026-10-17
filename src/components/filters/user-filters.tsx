'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useRef, useTransition } from 'react';
import { Loader2, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const ANY = 'any';

export function UserFilters() {
  const router = useRouter();
  const params = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const search = params.get('search') ?? '';
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const apply = (next: Record<string, string | undefined>) => {
    const query = new URLSearchParams(params.toString());
    for (const [key, value] of Object.entries(next)) {
      if (!value || value === ANY) query.delete(key);
      else query.set(key, value);
    }
    query.delete('page');
    startTransition(() => router.push(`/dashboard/admin/users?${query.toString()}`));
  };

  const onSearch = (value: string) => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => apply({ search: value }), 450);
  };

  return (
    <div className="mb-5 flex flex-col gap-3 sm:flex-row">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          key={search}
          defaultValue={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search name, email or phone..."
          className="pl-9"
        />
        {isPending && (
          <Loader2 className="absolute right-3 top-1/2 size-4 -translate-y-1/2 animate-spin text-muted-foreground" />
        )}
      </div>

      <Select
        value={params.get('role') ?? ANY}
        onValueChange={(value) => apply({ role: value })}
      >
        <SelectTrigger className="sm:w-40">
          <SelectValue placeholder="Any role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ANY}>Any role</SelectItem>
          <SelectItem value="CUSTOMER">Customer</SelectItem>
          <SelectItem value="TECHNICIAN">Technician</SelectItem>
          <SelectItem value="ADMIN">Admin</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={params.get('status') ?? ANY}
        onValueChange={(value) => apply({ status: value })}
      >
        <SelectTrigger className="sm:w-36">
          <SelectValue placeholder="Any status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ANY}>Any status</SelectItem>
          <SelectItem value="ACTIVE">Active</SelectItem>
          <SelectItem value="BANNED">Banned</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
