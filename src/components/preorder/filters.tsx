"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Filter, ArrowUpDown } from "lucide-react";

interface FiltersProps {
  currentStatus: string;
  currentSort: string;
}

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "title_asc", label: "Title A-Z" },
  { value: "title_desc", label: "Title Z-A" },
  { value: "price_asc", label: "Price: Low → High" },
  { value: "price_desc", label: "Price: High → Low" },
];

export default function Filters({ currentStatus, currentSort }: FiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const createQueryString = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(name, value);
    // Reset page to 1 on filter/sort change
    if (name === "status" || name === "sort") {
      params.set("page", "1");
    }
    return `/preorders?${params.toString()}`;
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    router.push(createQueryString("sort", e.target.value));
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-4 rounded-xl border border-neutral-200 shadow-sm">
      {/* Status Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
        <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mr-2 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5" /> Status
        </span>
        {[
          { id: "all", label: "All Preorders" },
          { id: "active", label: "Active" },
          { id: "inactive", label: "Inactive" },
        ].map((tab) => {
          const isActive = currentStatus === tab.id;
          return (
            <Link
              key={tab.id}
              href={createQueryString("status", tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? "bg-neutral-900 text-white shadow-sm"
                  : "text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      {/* Sorting Control */}
      <div className="flex items-center gap-2">
        <label htmlFor="sort-select" className="text-xs font-semibold text-neutral-400 uppercase tracking-wider flex items-center gap-1 shrink-0">
          <ArrowUpDown className="w-3.5 h-3.5" /> Sort By
        </label>
        <select
          id="sort-select"
          value={currentSort}
          onChange={handleSortChange}
          className="text-xs bg-neutral-50 hover:bg-neutral-100 border border-neutral-300 hover:border-neutral-400 text-neutral-700 rounded-lg p-2 font-medium focus:ring-1 focus:ring-neutral-950 focus:border-neutral-950 transition-all outline-none"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
