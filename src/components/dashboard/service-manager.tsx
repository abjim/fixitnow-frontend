'use client';

import { useState, useTransition } from 'react';
import { Loader2, Pencil, Plus, Trash2, Wrench } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { EmptyState } from '@/components/empty-state';
import { deleteServiceAction, saveServiceAction } from '@/actions/technician';
import { duration, taka } from '@/lib/format';
import type { Category, Service } from '@/lib/types';

export function ServiceManager({
  services,
  categories,
}: {
  services: Service[];
  categories: Category[];
}) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [categoryId, setCategoryId] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDeleting, startDelete] = useTransition();
  const [isSaving, startSave] = useTransition();

  const save = (formData: FormData) => {
    startSave(async () => {
      const result = await saveServiceAction({}, formData);

      if (result.ok) {
        toast.success(result.message ?? 'Saved');
        setOpen(false);
        setEditing(null);
        return;
      }

      setErrors(result.errors ?? {});
      if (result.message) toast.error(result.message);
    });
  };

  const openCreate = () => {
    setErrors({});
    setEditing(null);
    setCategoryId(categories[0]?.id ?? '');
    setOpen(true);
  };

  const openEdit = (service: Service) => {
    setErrors({});
    setEditing(service);
    setCategoryId(service.categoryId);
    setOpen(true);
  };

  const remove = (service: Service) => {
    startDelete(async () => {
      const result = await deleteServiceAction(service.id);
      if (result.ok) toast.success(result.message);
      else toast.error(result.message);
    });
  };

  return (
    <>
      <div className="mb-5 flex justify-end">
        <Button onClick={openCreate}>
          <Plus className="size-4" /> Add service
        </Button>
      </div>

      {services.length === 0 ? (
        <EmptyState
          title="No service added"
          description="Add the services you offer so customers can book them."
          icon={Wrench}
        >
          <Button onClick={openCreate}>Add your first service</Button>
        </EmptyState>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {services.map((service) => (
            <div key={service.id} className="rounded-xl border bg-card p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-heading font-semibold">{service.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {service.category.name}
                  </p>
                </div>
                {!service.isActive && <Badge variant="secondary">Hidden</Badge>}
              </div>

              <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                {service.description}
              </p>

              <div className="mt-3 flex items-center justify-between border-t pt-3">
                <p className="text-sm">
                  <span className="font-heading font-bold">
                    {taka(service.price)}
                  </span>
                  <span className="text-muted-foreground">
                    {' '}
                    · {duration(service.durationMinutes)}
                  </span>
                </p>
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" onClick={() => openEdit(service)}>
                    <Pencil className="size-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    disabled={isDeleting}
                    onClick={() => remove(service)}
                  >
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit service' : 'New service'}</DialogTitle>
            <DialogDescription>
              Customers will see this on your profile page.
            </DialogDescription>
          </DialogHeader>

          <form action={save} className="space-y-4">
            <input type="hidden" name="id" value={editing?.id ?? ''} />
            <input type="hidden" name="categoryId" value={categoryId} />

            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                defaultValue={editing?.title}
                placeholder="Water Pipe Leak Repair"
                required
              />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                rows={3}
                defaultValue={editing?.description}
                placeholder="What exactly do you do in this service?"
                required
              />
              {errors.description && (
                <p className="text-sm text-destructive">
                  {errors.description}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pick a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.categoryId && (
                <p className="text-sm text-destructive">
                  {errors.categoryId}
                </p>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="price">Price (৳)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  min={1}
                  defaultValue={editing?.price}
                  placeholder="900"
                  required
                />
                {errors.price && (
                  <p className="text-sm text-destructive">{errors.price}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="durationMinutes">Duration (minutes)</Label>
                <Input
                  id="durationMinutes"
                  name="durationMinutes"
                  type="number"
                  min={15}
                  max={600}
                  step={15}
                  defaultValue={editing?.durationMinutes ?? 60}
                  required
                />
                {errors.durationMinutes && (
                  <p className="text-sm text-destructive">
                    {errors.durationMinutes}
                  </p>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving && <Loader2 className="size-4 animate-spin" />}
                {editing ? 'Save changes' : 'Create service'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
