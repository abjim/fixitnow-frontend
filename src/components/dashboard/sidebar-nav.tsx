'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  CalendarRange,
  CreditCard,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  Star,
  Wrench,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { logoutAction } from '@/actions/auth';
import { cn } from '@/lib/utils';
import type { Role, User } from '@/lib/types';

type Item = { href: string; label: string; icon: typeof Home };

const menus: Record<Role, Item[]> = {
  CUSTOMER: [
    { href: '/dashboard/customer', label: 'Overview', icon: LayoutDashboard },
    { href: '/dashboard/customer/bookings', label: 'My bookings', icon: CalendarRange },
    { href: '/dashboard/customer/payments', label: 'Payments', icon: CreditCard },
    { href: '/dashboard/customer/reviews', label: 'My reviews', icon: Star },
  ],
  TECHNICIAN: [
    { href: '/dashboard/technician', label: 'Overview', icon: LayoutDashboard },
  ],
  ADMIN: [
    { href: '/dashboard/admin', label: 'Overview', icon: LayoutDashboard },
  ],
};

const roleLabel: Record<Role, string> = {
  CUSTOMER: 'Customer',
  TECHNICIAN: 'Technician',
  ADMIN: 'Administrator',
};

function NavLinks({ user, onNavigate }: { user: User; onNavigate?: () => void }) {
  const pathname = usePathname();
  const items = menus[user.role];

  return (
    <nav className="flex flex-col gap-1">
      {items.map((item) => {
        // overview is a prefix of every other link, so match it exactly
        const active =
          item.href === menus[user.role][0].href
            ? pathname === item.href
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              'flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors',
              active
                ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                : 'text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
            )}
          >
            <item.icon className="size-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarBody({ user, onNavigate }: { user: User; onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col">
      <Link
        href="/"
        onClick={onNavigate}
        className="flex items-center gap-2 px-3 py-4"
      >
        <span className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <Wrench className="size-4" />
        </span>
        <span className="font-heading text-lg font-bold">FixItNow</span>
      </Link>

      <div className="mb-4 rounded-lg bg-sidebar-accent/60 px-3 py-2.5">
        <p className="truncate text-sm font-medium">{user.name}</p>
        <p className="text-xs text-muted-foreground">{roleLabel[user.role]}</p>
      </div>

      <NavLinks user={user} onNavigate={onNavigate} />

      <div className="mt-auto space-y-1 border-t pt-3">
        <Link
          href="/"
          onClick={onNavigate}
          className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-sidebar-foreground/80 hover:bg-sidebar-accent"
        >
          <Home className="size-4" />
          Back to site
        </Link>
        <form action={logoutAction}>
          <button
            type="submit"
            className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10"
          >
            <LogOut className="size-4" />
            Log out
          </button>
        </form>
      </div>
    </div>
  );
}

export function DashboardSidebar({ user }: { user: User }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r bg-sidebar p-3 lg:flex lg:flex-col">
        <SidebarBody user={user} />
      </aside>

      <div className="sticky top-0 z-30 flex items-center gap-3 border-b bg-background px-4 py-3 lg:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="size-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 bg-sidebar p-3">
            <SheetTitle className="sr-only">Dashboard menu</SheetTitle>
            <SidebarBody user={user} onNavigate={() => setOpen(false)} />
          </SheetContent>
        </Sheet>

        <span className="font-heading font-bold">FixItNow</span>
      </div>
    </>
  );
}
