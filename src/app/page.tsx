import Link from "next/link";
import prisma from "@/lib/prisma";
import PreorderTable from "./components/PreorderTable";
import { ArrowUpDown } from "lucide-react";

export default async function Home(props: { searchParams?: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const searchParams = await props.searchParams;
  const statusParam = typeof searchParams?.status === "string" ? searchParams.status : "All";
  const sortByParam = typeof searchParams?.sortBy === "string" ? searchParams.sortBy : "createdAt";
  const orderParam = typeof searchParams?.order === "string" ? searchParams.order : "desc";
  const pageParam = typeof searchParams?.page === "string" ? parseInt(searchParams.page) : 1;
  const pageSize = 10;

  // Build where clause
  const where: any = {};
  if (statusParam !== "All") {
    where.status = statusParam;
  }

  // Build orderBy clause
  const orderBy: any = {};
  if (sortByParam === "Name") {
    orderBy.name = orderParam;
  } else if (sortByParam === "Starts At") {
    orderBy.startsAt = orderParam;
  } else if (sortByParam === "Ends At") {
    orderBy.endsAt = orderParam;
  } else {
    // Default or "Created At"
    orderBy.createdAt = orderParam;
  }

  // Fetch total count and paginated records
  const totalCount = await prisma.preorder.count({ where });
  const preorders = await prisma.preorder.findMany({
    where,
    orderBy,
    skip: (pageParam - 1) * pageSize,
    take: pageSize,
  });

  const totalPages = Math.ceil(totalCount / pageSize) || 1;
  const startItem = (pageParam - 1) * pageSize + 1;
  const endItem = Math.min(pageParam * pageSize, totalCount);

  // Helper to build URL with new params
  const buildUrl = (updates: Record<string, string>) => {
    const params = new URLSearchParams();
    if (statusParam !== "All") params.set("status", statusParam);
    if (sortByParam !== "createdAt") params.set("sortBy", sortByParam);
    if (orderParam !== "desc") params.set("order", orderParam);
    if (pageParam !== 1) params.set("page", pageParam.toString());

    Object.entries(updates).forEach(([key, value]) => {
      params.set(key, value);
    });

    // Reset page if filtering or sorting changes
    if (updates.status || updates.sortBy || updates.order) {
      params.delete("page");
    }

    return `/?${params.toString()}`;
  };

  return (
    <main className="flex-1 p-8 bg-neutral-100 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Preorders</h1>
          <Link
            href="/new"
            className="rounded-lg bg-neutral-900 text-white px-4 py-2 text-sm font-medium hover:bg-neutral-800 transition-colors"
          >
            Create Preorder
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
          {/* Header Controls */}
          <div className="flex items-center justify-between p-4 border-b border-neutral-100">
            <div className="flex space-x-1">
              {["All", "Active", "Inactive"].map((tab) => {
                const isActive = statusParam === tab;
                return (
                  <Link
                    key={tab}
                    href={buildUrl({ status: tab })}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-neutral-100 text-neutral-900"
                        : "text-neutral-500 hover:text-neutral-700 hover:bg-neutral-50"
                    }`}
                  >
                    {tab}
                  </Link>
                );
              })}
            </div>

            <div className="relative group">
              <button className="p-1.5 border border-neutral-200 rounded text-neutral-500 hover:bg-neutral-50 transition-colors">
                <ArrowUpDown className="w-4 h-4" />
              </button>
              {/* Sort Dropdown */}
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-neutral-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 p-2">
                <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider px-2 py-1 mb-1">
                  Sort by
                </div>
                {["Name", "Created At", "Starts At", "Ends At"].map((sortOpt) => (
                  <Link
                    key={sortOpt}
                    href={buildUrl({ sortBy: sortOpt })}
                    className="flex items-center px-2 py-1.5 text-sm rounded-md hover:bg-neutral-50 text-neutral-700"
                  >
                    <div className={`w-3 h-3 rounded-full border mr-2 flex items-center justify-center ${sortByParam === sortOpt ? 'border-neutral-900' : 'border-neutral-300'}`}>
                      {sortByParam === sortOpt && <div className="w-1.5 h-1.5 rounded-full bg-neutral-900" />}
                    </div>
                    {sortOpt}
                  </Link>
                ))}
                
                <div className="h-px bg-neutral-100 my-2"></div>
                
                <Link
                  href={buildUrl({ order: "asc" })}
                  className={`flex items-center px-2 py-1.5 text-sm rounded-md hover:bg-neutral-50 ${orderParam === "asc" ? "bg-neutral-100 font-medium text-neutral-900" : "text-neutral-700"}`}
                >
                  <span className="mr-2">↑</span> Ascending
                </Link>
                <Link
                  href={buildUrl({ order: "desc" })}
                  className={`flex items-center px-2 py-1.5 text-sm rounded-md hover:bg-neutral-50 ${orderParam === "desc" ? "bg-neutral-100 font-medium text-neutral-900" : "text-neutral-700"}`}
                >
                  <span className="mr-2">↓</span> Descending
                </Link>
              </div>
            </div>
          </div>

          <PreorderTable preorders={preorders} />

          {/* Pagination */}
          <div className="flex items-center justify-center p-4 border-t border-neutral-100 bg-neutral-50/50">
            <div className="flex items-center space-x-4">
              <Link
                href={buildUrl({ page: Math.max(1, pageParam - 1).toString() })}
                className={`p-1 rounded ${pageParam === 1 ? "text-neutral-300 cursor-not-allowed" : "text-neutral-500 hover:bg-neutral-200"}`}
                aria-disabled={pageParam === 1}
              >
                <span className="sr-only">Previous</span>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <span className="text-sm text-neutral-600 font-medium">
                Showing {totalCount === 0 ? 0 : startItem} to {endItem} from {totalCount}
              </span>
              <Link
                href={buildUrl({ page: Math.min(totalPages, pageParam + 1).toString() })}
                className={`p-1 rounded ${pageParam === totalPages ? "text-neutral-300 cursor-not-allowed" : "text-neutral-500 hover:bg-neutral-200"}`}
                aria-disabled={pageParam === totalPages}
              >
                <span className="sr-only">Next</span>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
