import type { LucideIcon } from 'lucide-react';
import { Inbox } from 'lucide-react';

type Props = {
  title: string;
  description?: string;
  icon?: LucideIcon;
  children?: React.ReactNode;
};

export function EmptyState({ title, description, icon: Icon = Inbox, children }: Props) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed px-6 py-14 text-center">
      <span className="mb-3 flex size-11 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <Icon className="size-5" />
      </span>
      <p className="font-medium">{title}</p>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
      )}
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}
