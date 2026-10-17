'use client';

import { useState, useTransition } from 'react';
import { Ban, Loader2, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
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
import { updateUserStatusAction } from '@/actions/admin';
import { dateOnly } from '@/lib/format';
import type { User } from '@/lib/types';

const roleBadge = {
  CUSTOMER: 'secondary',
  TECHNICIAN: 'default',
  ADMIN: 'outline',
} as const;

export function UserTable({ users, adminId }: { users: User[]; adminId?: string }) {
  const [target, setTarget] = useState<User | null>(null);
  const [isPending, startTransition] = useTransition();

  const confirm = () => {
    if (!target) return;
    const next = target.status === 'ACTIVE' ? 'BANNED' : 'ACTIVE';

    startTransition(async () => {
      const result = await updateUserStatusAction(target.id, next);
      if (result.ok) {
        toast.success(next === 'BANNED' ? 'User banned' : 'User unbanned');
        setTarget(null);
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <>
      <div className="overflow-x-auto rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell className="text-muted-foreground">{user.email}</TableCell>
                <TableCell className="text-muted-foreground">
                  {user.phone ?? '-'}
                </TableCell>
                <TableCell>
                  <Badge variant={roleBadge[user.role]}>
                    {user.role.charAt(0) + user.role.slice(1).toLowerCase()}
                  </Badge>
                </TableCell>
                <TableCell className="whitespace-nowrap text-muted-foreground">
                  {dateOnly(user.createdAt)}
                </TableCell>
                <TableCell>
                  <span
                    className={
                      user.status === 'ACTIVE'
                        ? 'text-sm text-emerald-600 dark:text-emerald-400'
                        : 'text-sm text-destructive'
                    }
                  >
                    {user.status === 'ACTIVE' ? 'Active' : 'Banned'}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  {user.id === adminId || user.role === 'ADMIN' ? (
                    <span className="text-xs text-muted-foreground">-</span>
                  ) : (
                    <Button
                      size="sm"
                      variant={user.status === 'ACTIVE' ? 'ghost' : 'outline'}
                      className={user.status === 'ACTIVE' ? 'text-destructive' : ''}
                      onClick={() => setTarget(user)}
                    >
                      {user.status === 'ACTIVE' ? (
                        <>
                          <Ban className="size-4" /> Ban
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="size-4" /> Unban
                        </>
                      )}
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={Boolean(target)} onOpenChange={(open) => !open && setTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {target?.status === 'ACTIVE' ? 'Ban this user?' : 'Unban this user?'}
            </DialogTitle>
            <DialogDescription>
              {target?.status === 'ACTIVE'
                ? `${target?.name} will not be able to log in anymore.`
                : `${target?.name} will get access back.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTarget(null)}>
              Cancel
            </Button>
            <Button
              variant={target?.status === 'ACTIVE' ? 'destructive' : 'default'}
              onClick={confirm}
              disabled={isPending}
            >
              {isPending && <Loader2 className="size-4 animate-spin" />}
              Yes, do it
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
