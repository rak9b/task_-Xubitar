"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
}

export default function Pagination({
  currentPage,
  totalPages,
  totalCount,
  pageSize,
}: PaginationProps) {
  const searchParams = useSearchParams();

  const createPageLink = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", pageNumber.toString());
    return `/preorders?${params.toString()}`;
  };

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalCount);

  // Generate page numbers array, e.g. [1, 2, 3]
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  if (totalPages <= 1) {
    return (
      <div className="flex items-center justify-between border-t border-neutral-200 bg-neutral-50/50 px-6 py-4 rounded-b-xl">
        <span className="text-xs text-neutral-500 font-medium">
          Showing {totalCount === 0 ? 0 : startItem} to {endItem} of {totalCount} records
        </span>
        <span className="text-xs text-neutral-400 font-medium">Page 1 of 1</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between border-t border-neutral-200 bg-neutral-50/50 px-6 py-4 rounded-b-xl">
      <div className="text-xs text-neutral-500 font-medium order-2 sm:order-1">
        Showing <span className="font-semibold text-neutral-800">{startItem}</span> to{" "}
        <span className="font-semibold text-neutral-800">{endItem}</span> of{" "}
        <span className="font-semibold text-neutral-800">{totalCount}</span> preorders
      </div>

      <div className="flex items-center gap-1.5 order-1 sm:order-2">
        {/* Previous Button */}
        {currentPage > 1 ? (
          <Link
            href={createPageLink(currentPage - 1)}
            className="p-1.5 border border-neutral-300 hover:border-neutral-400 rounded-lg hover:bg-neutral-100 text-neutral-700 transition-colors"
            title="Previous Page"
          >
            <ChevronLeft className="w-4 h-4" />
          </Link>
        ) : (
          <button
            disabled
            className="p-1.5 border border-neutral-200 rounded-lg text-neutral-300 bg-neutral-50 cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}

        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          {pageNumbers.map((pageNum) => {
            const isActive = pageNum === currentPage;
            return (
              <Link
                key={pageNum}
                href={createPageLink(pageNum)}
                className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-neutral-900 text-white shadow-sm"
                    : "border border-neutral-300 hover:border-neutral-400 text-neutral-600 hover:bg-neutral-100"
                }`}
              >
                {pageNum}
              </Link>
            );
          })}
        </div>

        {/* Next Button */}
        {currentPage < totalPages ? (
          <Link
            href={createPageLink(currentPage + 1)}
            className="p-1.5 border border-neutral-300 hover:border-neutral-400 rounded-lg hover:bg-neutral-100 text-neutral-700 transition-colors"
            title="Next Page"
          >
            <ChevronRight className="w-4 h-4" />
          </Link>
        ) : (
          <button
            disabled
            className="p-1.5 border border-neutral-200 rounded-lg text-neutral-300 bg-neutral-50 cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
