'use client';

import { useState, useTransition } from 'react';
import { FolderTree, Loader2, Pencil, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { EmptyState } from '@/components/empty-state';
import { deleteCategoryAction, saveCategoryAction } from '@/actions/admin';
import type { Category } from '@/lib/types';

export function CategoryManager({ categories }: { categories: Category[] }) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [removing, setRemoving] = useState<Category | null>(null);
  const [isSaving, startSave] = useTransition();
  const [isDeleting, startDelete] = useTransition();

  const save = (formData: FormData) => {
    startSave(async () => {
      const result = await saveCategoryAction({}, formData);

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

  const remove = () => {
    if (!removing) return;

    startDelete(async () => {
      const result = await deleteCategoryAction(removing.id);
      if (result.ok) {
        toast.success(result.message);
        setRemoving(null);
      } else {
        toast.error(result.message);
      }
    });
  };

  const openForm = (category: Category | null) => {
    setErrors({});
    setEditing(category);
    setOpen(true);
  };

  return (
    <>
      <div className="mb-5 flex justify-end">
        <Button onClick={() => openForm(null)}>
          <Plus className="size-4" /> Add category
        </Button>
      </div>

      {categories.length === 0 ? (
        <EmptyState
          title="No category"
          description="Categories group the services customers browse."
          icon={FolderTree}
        >
          <Button onClick={() => openForm(null)}>Create one</Button>
        </EmptyState>
      ) : (
        <div className="overflow-x-auto rounded-xl border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Services</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">
                    {category.name}
                    {!category.isActive && (
                      <Badge variant="secondary" className="ml-2">
                        Hidden
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {category.slug}
                  </TableCell>
                  <TableCell className="max-w-xs truncate text-muted-foreground">
                    {category.description ?? '-'}
                  </TableCell>
                  <TableCell>{category._count?.services ?? 0}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => openForm(category)}
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setRemoving(category)}
                      >
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit category' : 'New category'}</DialogTitle>
            <DialogDescription>
              The slug is generated from the name by the server.
            </DialogDescription>
          </DialogHeader>

          <form action={save} className="space-y-4">
            <input type="hidden" name="id" value={editing?.id ?? ''} />

            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                defaultValue={editing?.name}
                placeholder="Plumbing"
                required
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                name="description"
                rows={3}
                defaultValue={editing?.description ?? ''}
                placeholder="Pipe leak, tap fitting, bathroom work"
              />
              {errors.description && (
                <p className="text-sm text-destructive">{errors.description}</p>
              )}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving && <Loader2 className="size-4 animate-spin" />}
                {editing ? 'Save changes' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(removing)}
        onOpenChange={(value) => !value && setRemoving(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete {removing?.name}?</DialogTitle>
            <DialogDescription>
              A category that already has services can not be deleted.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRemoving(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={remove} disabled={isDeleting}>
              {isDeleting && <Loader2 className="size-4 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
