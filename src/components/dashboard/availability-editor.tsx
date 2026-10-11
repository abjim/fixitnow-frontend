'use client';

import { useState, useTransition } from 'react';
import { Loader2, Plus, Save, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { updateAvailabilityAction } from '@/actions/technician';
import { cn } from '@/lib/utils';
import { DAY_NAMES, DAY_SHORT } from '@/lib/format';
import type { Availability } from '@/lib/types';

// TODO: blocking a single date is not possible yet, only the weekly hours
type Slot = { dayOfWeek: number; startTime: string; endTime: string };

const defaultSlot = { startTime: '09:00', endTime: '18:00' };

export function AvailabilityEditor({ initial }: { initial: Availability[] }) {
  const [slots, setSlots] = useState<Slot[]>(
    initial.map((s) => ({
      dayOfWeek: s.dayOfWeek,
      startTime: s.startTime,
      endTime: s.endTime,
    })),
  );
  const [isPending, startTransition] = useTransition();

  const slotsOf = (day: number) => slots.filter((s) => s.dayOfWeek === day);

  const toggleDay = (day: number) => {
    setSlots((prev) =>
      slotsOf(day).length
        ? prev.filter((s) => s.dayOfWeek !== day)
        : [...prev, { dayOfWeek: day, ...defaultSlot }],
    );
  };

  const addBlock = (day: number) => {
    setSlots((prev) => [...prev, { dayOfWeek: day, ...defaultSlot }]);
  };

  const removeBlock = (day: number, index: number) => {
    let seen = -1;
    setSlots((prev) =>
      prev.filter((slot) => {
        if (slot.dayOfWeek !== day) return true;
        seen += 1;
        return seen !== index;
      }),
    );
  };

  const editBlock = (
    day: number,
    index: number,
    key: 'startTime' | 'endTime',
    value: string,
  ) => {
    let seen = -1;
    setSlots((prev) =>
      prev.map((slot) => {
        if (slot.dayOfWeek !== day) return slot;
        seen += 1;
        return seen === index ? { ...slot, [key]: value } : slot;
      }),
    );
  };

  const save = () => {
    // backend rejects a day that has two blocks with the same start time
    const seen = new Set<string>();
    for (const slot of slots) {
      const key = `${slot.dayOfWeek}-${slot.startTime}`;
      if (seen.has(key)) {
        toast.error(
          `${DAY_NAMES[slot.dayOfWeek]} has two blocks starting at ${slot.startTime}`,
        );
        return;
      }
      if (slot.startTime >= slot.endTime) {
        toast.error(`End time must be after start time on ${DAY_NAMES[slot.dayOfWeek]}`);
        return;
      }
      seen.add(key);
    }

    startTransition(async () => {
      const result = await updateAvailabilityAction(slots);
      if (result.ok) toast.success('Availability saved');
      else toast.error(result.message);
    });
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border bg-card p-5">
        <p className="font-heading font-semibold">Working days</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Turn on the days you work, then set the hours. Customers can only book
          inside these hours.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {DAY_SHORT.map((label, day) => (
            <button
              key={label}
              type="button"
              onClick={() => toggleDay(day)}
              className={cn(
                'rounded-full border px-3.5 py-1.5 text-sm transition-colors',
                slotsOf(day).length
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'hover:bg-accent',
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {DAY_NAMES.map((name, day) => {
          const blocks = slotsOf(day);
          if (!blocks.length) return null;

          return (
            <div key={name} className="rounded-xl border bg-card p-4">
              <div className="flex items-center justify-between">
                <p className="font-medium">{name}</p>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => addBlock(day)}
                >
                  <Plus className="size-4" /> Add block
                </Button>
              </div>

              <div className="mt-3 space-y-2">
                {blocks.map((block, index) => (
                  <div key={index} className="flex flex-wrap items-end gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">From</Label>
                      <Input
                        type="time"
                        step={3600}
                        value={block.startTime}
                        onChange={(e) =>
                          editBlock(day, index, 'startTime', e.target.value)
                        }
                        className="w-32"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">To</Label>
                      <Input
                        type="time"
                        step={3600}
                        value={block.endTime}
                        onChange={(e) =>
                          editBlock(day, index, 'endTime', e.target.value)
                        }
                        className="w-32"
                      />
                    </div>
                    {blocks.length > 1 && (
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        onClick={() => removeBlock(day, index)}
                      >
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {slots.length === 0 && (
        <p className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
          No working day selected. Customers will not be able to book you.
        </p>
      )}

      <Button onClick={save} disabled={isPending}>
        {isPending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Save className="size-4" />
        )}
        Save availability
      </Button>
    </div>
  );
}
