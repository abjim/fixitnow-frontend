import { redirect } from 'next/navigation';
import { DashboardSidebar } from '@/components/dashboard/sidebar-nav';
import { getCurrentUser } from '@/lib/session';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  // proxy already blocks this, keeping it as a second guard
  if (!user) redirect('/login');

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <DashboardSidebar user={user} />
      <main className="min-w-0 flex-1 bg-muted/30 px-4 py-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
