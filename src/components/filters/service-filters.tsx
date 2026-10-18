'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useRef, useTransition } from 'react';
import { Loader2, Search, SlidersHorizontal, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import type { Category } from '@/lib/types';

const ANY = 'any';

const sortOptions = [
  { value: 'rating-desc', label: 'Top rated' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'createdAt-desc', label: 'Newest first' },
];

const filterKeys = ['category', 'city', 'minPrice', 'maxPrice', 'minRating'];

export function ServiceFilters({
  categories,
  cities,
}: {
  categories: Category[];
  cities: string[];
}) {
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

    startTransition(() => router.push(`/services?${query.toString()}`));
  };

  // debounce, otherwise every keystroke pushes a new url
  const onSearch = (value: string) => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => apply({ search: value }), 450);
  };

  const sortValue = `${params.get('sortBy') ?? 'rating'}-${params.get('sortOrder') ?? 'desc'}`;
  const activeCount = filterKeys.filter((key) => params.get(key)).length;

  const fields = (
    <>
      <div className="space-y-2 sm:w-44">
        <Label className="lg:sr-only">Category</Label>
        <Select
          value={params.get('category') ?? ANY}
          onValueChange={(value) => apply({ category: value })}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Any category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ANY}>Any category</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.slug}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2 sm:w-40">
        <Label className="lg:sr-only">City</Label>
        <Select
          value={params.get('city') ?? ANY}
          onValueChange={(value) => apply({ city: value })}
        >
          <SelectTrigger className="w-full">
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
      </div>

      <div className="space-y-2 sm:w-40">
        <Label className="lg:sr-only">Rating</Label>
        <Select
          value={params.get('minRating') ?? ANY}
          onValueChange={(value) => apply({ minRating: value })}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Any rating" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ANY}>Any rating</SelectItem>
            <SelectItem value="4">4 star &amp; up</SelectItem>
            <SelectItem value="3">3 star &amp; up</SelectItem>
            <SelectItem value="2">2 star &amp; up</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="lg:sr-only">Price</Label>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            min={0}
            placeholder="Min ৳"
            className="sm:w-24"
            defaultValue={params.get('minPrice') ?? ''}
            onBlur={(e) => apply({ minPrice: e.target.value })}
          />
          <Input
            type="number"
            min={0}
            placeholder="Max ৳"
            className="sm:w-24"
            defaultValue={params.get('maxPrice') ?? ''}
            onBlur={(e) => apply({ maxPrice: e.target.value })}
          />
        </div>
      </div>
    </>
  );

  return (
    <div className="mb-6 space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            key={search}
            defaultValue={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search for a service..."
            className="pl-9"
          />
          {isPending && (
            <Loader2 className="absolute right-3 top-1/2 size-4 -translate-y-1/2 animate-spin text-muted-foreground" />
          )}
        </div>

        <div className="flex items-center gap-2">
          <Select
            value={sortValue}
            onValueChange={(value) => {
              const [sortBy, sortOrder] = value.split('-');
              apply({ sortBy, sortOrder });
            }}
          >
            <SelectTrigger className="w-[165px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="lg:hidden">
                <SlidersHorizontal className="size-4" />
                Filters
                {activeCount > 0 && (
                  <span className="rounded-full bg-primary px-1.5 text-xs text-primary-foreground">
                    {activeCount}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 overflow-y-auto">
              <SheetTitle className="px-4 pt-4">Filters</SheetTitle>
              <div className="flex flex-col gap-4 p-4">{fields}</div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="hidden flex-wrap items-end gap-3 lg:flex">
        {fields}
        {activeCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              startTransition(() =>
                router.push(search ? `/services?search=${search}` : '/services'),
              )
            }
          >
            <X className="size-4" /> Clear
          </Button>
        )}
      </div>
    </div>
  );
}
