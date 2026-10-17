import { PageHeader } from '@/components/dashboard/page-header';
import { CategoryManager } from '@/components/admin/category-manager';
import { SearchBox } from '@/components/filters/search-box';
import { Pagination } from '@/components/pagination';
import { getAdminCategories } from '@/lib/queries';

export default async function AdminCategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; page?: string }>;
}) {
  const params = await searchParams;

  const res = await getAdminCategories({
    search: params.search,
    page: Number(params.page ?? 1),
    limit: 20,
    sortBy: 'name',
    sortOrder: 'asc',
  });

  return (
    <>
      <PageHeader
        title="Categories"
        description="Services are grouped under these categories."
      />

      <SearchBox
        basePath="/dashboard/admin/categories"
        placeholder="Search category..."
      />

      <CategoryManager categories={res.data ?? []} />

      <Pagination
        page={res.meta?.page ?? 1}
        totalPage={res.meta?.totalPage ?? 1}
        basePath="/dashboard/admin/categories"
      />
    </>
  );
}
