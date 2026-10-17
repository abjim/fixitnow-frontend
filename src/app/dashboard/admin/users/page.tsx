import { Users } from 'lucide-react';
import { PageHeader } from '@/components/dashboard/page-header';
import { UserFilters } from '@/components/filters/user-filters';
import { UserTable } from '@/components/admin/user-table';
import { Pagination } from '@/components/pagination';
import { EmptyState } from '@/components/empty-state';
import { getAdminUsers } from '@/lib/queries';
import { getCurrentUser } from '@/lib/session';

type Search = { search?: string; role?: string; status?: string; page?: string };

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const params = await searchParams;

  const [me, res] = await Promise.all([
    getCurrentUser(),
    getAdminUsers({
      search: params.search,
      role: params.role,
      status: params.status,
      page: Number(params.page ?? 1),
      limit: 10,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    }),
  ]);

  const users = res.data ?? [];

  return (
    <>
      <PageHeader
        title="Users"
        description={`${res.meta?.total ?? 0} accounts on the platform.`}
      />

      <UserFilters />

      {users.length === 0 ? (
        <EmptyState
          title="No user found"
          description="Try changing the search or the filters."
          icon={Users}
        />
      ) : (
        <>
          <UserTable users={users} adminId={me?.id} />
          <Pagination
            page={res.meta?.page ?? 1}
            totalPage={res.meta?.totalPage ?? 1}
            basePath="/dashboard/admin/users"
          />
        </>
      )}
    </>
  );
}
