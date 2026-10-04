'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
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

export function TechnicianFilters({ cities }: { cities: string[] }) {
  const router = useRouter();
  const params = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState(params.get('search') ?? '');

  const apply = (next: Record<string, string | undefined>) => {
    const query = new URLSearchParams(params.toString());
    for (const [key, value] of Object.entries(next)) {
      if (!value || value === ANY) query.delete(key);
      else query.set(key, value);
    }
    query.delete('page');
    startTransition(() => router.push(`/technicians?${query.toString()}`));
  };

  useEffect(() => {
    setSearch(params.get('search') ?? '');
  }, [params]);

  const onSearch = (value: string) => {
    setSearch(value);
    apply({ search: value });
  };

  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search by name, area or skill..."
          className="pl-9"
        />
        {isPending && (
          <Loader2 className="absolute right-3 top-1/2 size-4 -translate-y-1/2 animate-spin text-muted-foreground" />
        )}
      </div>

      <Select
        value={params.get('city') ?? ANY}
        onValueChange={(value) => apply({ city: value })}
      >
        <SelectTrigger className="sm:w-44">
          <SelectValue placeholder="Any city" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ANY}>Any city</SelectItem>
          {cities.map((city) => (
            <SelectItem key={city} value={city}>
              {city}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={params.get('minRating') ?? ANY}
        onValueChange={(value) => apply({ minRating: value })}
      >
        <SelectTrigger className="sm:w-40">
          <SelectValue placeholder="Any rating" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ANY}>Any rating</SelectItem>
          <SelectItem value="4">4 star &amp; up</SelectItem>
          <SelectItem value="3">3 star &amp; up</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
