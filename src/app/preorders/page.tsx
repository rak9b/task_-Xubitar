import Link from "next/link";
import { Suspense } from "react";
import { Plus, Package2, ShieldCheck, HelpCircle } from "lucide-react";
import { getPreorders } from "@/lib/preorder-service";
import PreorderTable from "@/components/preorder/preorder-table";
import Filters from "@/components/preorder/filters";
import Pagination from "@/components/preorder/pagination";

// Exempt this dynamic searchParams-driven page from static prefetch validation
export const unstable_instant = false;

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function PreordersPage({ searchParams }: PageProps) {
  return (
    <div className="flex-1 bg-neutral-50/50 min-h-screen">
      {/* Top Banner Header - Static and loads instantly */}
      <header className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-neutral-900 text-white flex items-center justify-center shadow-sm">
              <Package2 className="w-5.5 h-5.5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-neutral-950 tracking-tight">Preorder Manager</h1>
              <p className="text-xs text-neutral-400 font-medium">Manage and track your customer pre-release orders</p>
            </div>
          </div>
          <Link
            href="/preorders/create"
            className="inline-flex items-center justify-center gap-1.5 px-4.5 py-2.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-xl shadow-sm transition-all hover:scale-[1.01] active:scale-[0.99]"
          >
            <Plus className="w-4 h-4" /> Create Preorder
          </Link>
        </div>
      </header>

      {/* Main Content Area with Suspense boundary */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <Suspense fallback={<DashboardSkeleton />}>
          <PreordersContent searchParams={searchParams} />
        </Suspense>
      </main>
    </div>
  );
}

async function PreordersContent({ searchParams }: { searchParams: PageProps["searchParams"] }) {
  const params = await searchParams;
  const status = typeof params.status === "string" ? params.status : "all";
  const sort = typeof params.sort === "string" ? params.sort : "newest";
  const page = typeof params.page === "string" ? parseInt(params.page, 10) : 1;
  const pageSize = 10;

  // Fetch paginated, filtered, sorted data on the server
  const { preorders, totalCount, currentPage, totalPages } = await getPreorders({
    status,
    sort,
    page,
    pageSize,
  });

  // Calculate overview stats
  const totalValue = preorders.reduce((sum, p) => sum + p.price * p.quantity, 0);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider">Total Preorders</span>
            <span className="block text-2xl font-bold text-neutral-900 mt-1">{totalCount}</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-neutral-50 flex items-center justify-center text-neutral-500 border border-neutral-100">
            <Package2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider">Current Page Items</span>
            <span className="block text-2xl font-bold text-neutral-900 mt-1">{preorders.length}</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-neutral-50 flex items-center justify-center text-emerald-600 border border-neutral-100">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider">Page Estimated Value</span>
            <span className="block text-2xl font-bold text-neutral-900 mt-1">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(totalValue)}
            </span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-neutral-50 flex items-center justify-center text-neutral-500 border border-neutral-100">
            <HelpCircle className="w-5 h-5" />
          </div>
        </div>
      </section>

      {/* Filters bar */}
      <Filters currentStatus={status} currentSort={sort} />

      {/* Table & Pagination Wrapper */}
      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
        <PreorderTable preorders={preorders} />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalCount={totalCount}
          pageSize={pageSize}
        />
      </div>
    </div>
  );
}

// Skeleton loading UI component for the entire dashboard
function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Stats Cards Skeleton */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {Array.from({ length: 3 }).map((_, idx) => (
          <div key={idx} className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-3 bg-neutral-100 rounded w-24 animate-pulse" />
              <div className="h-7 bg-neutral-100 rounded w-16 animate-pulse" />
            </div>
            <div className="w-10 h-10 rounded-lg bg-neutral-100 animate-pulse" />
          </div>
        ))}
      </section>

      {/* Filters Skeleton */}
      <div className="h-14 bg-white rounded-xl border border-neutral-200 shadow-sm animate-pulse" />

      {/* Table & Pagination Skeleton */}
      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
        <div className="w-full overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-200">
                <th className="py-4 px-4 w-12 text-center">
                  <div className="w-4 h-4 bg-neutral-200 rounded animate-pulse mx-auto" />
                </th>
                <th className="py-4 px-4"><div className="h-4 bg-neutral-200 rounded w-24 animate-pulse" /></th>
                <th className="py-4 px-4"><div className="h-4 bg-neutral-200 rounded w-16 animate-pulse" /></th>
                <th className="py-4 px-4"><div className="h-4 bg-neutral-200 rounded w-24 animate-pulse" /></th>
                <th className="py-4 px-4 text-right"><div className="h-4 bg-neutral-200 rounded w-12 animate-pulse ml-auto" /></th>
                <th className="py-4 px-4 text-right"><div className="h-4 bg-neutral-200 rounded w-16 animate-pulse ml-auto" /></th>
                <th className="py-4 px-4 text-center"><div className="h-4 bg-neutral-200 rounded w-14 animate-pulse mx-auto" /></th>
                <th className="py-4 px-4"><div className="h-4 bg-neutral-200 rounded w-20 animate-pulse" /></th>
                <th className="py-4 px-4 text-center"><div className="h-4 bg-neutral-200 rounded w-16 animate-pulse mx-auto" /></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {Array.from({ length: 5 }).map((_, idx) => (
                <tr key={idx} className="bg-white">
                  <td className="py-4 px-4 text-center">
                    <div className="w-4 h-4 bg-neutral-100 rounded animate-pulse mx-auto" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="h-4 bg-neutral-100 rounded w-36 animate-pulse" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="h-3 bg-neutral-100 rounded w-16 animate-pulse font-mono" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="h-4 bg-neutral-100 rounded w-28 animate-pulse" />
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="h-4 bg-neutral-100 rounded w-8 animate-pulse ml-auto" />
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="h-4 bg-neutral-100 rounded w-14 animate-pulse ml-auto font-semibold" />
                  </td>
                  <td className="py-4 px-4 text-center">
                    <div className="w-9 h-5 bg-neutral-100 rounded-full animate-pulse mx-auto" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="h-3 bg-neutral-100 rounded w-20 animate-pulse" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex gap-2 justify-center">
                      <div className="w-8 h-8 bg-neutral-100 rounded-lg animate-pulse" />
                      <div className="w-8 h-8 bg-neutral-100 rounded-lg animate-pulse" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="h-14 bg-neutral-50 animate-pulse border-t" />
      </div>
    </div>
  );
}
