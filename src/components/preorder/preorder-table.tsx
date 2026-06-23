"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Edit2, Package, Inbox, Plus } from "lucide-react";
import { SerializedPreorder } from "@/lib/preorder-service";
import StatusSwitch from "./status-switch";
import DeleteDialog from "./delete-dialog";
import { formatCurrency, formatDate } from "@/lib/utils";

interface PreorderTableProps {
  preorders: SerializedPreorder[];
}

export default function PreorderTable({ preorders }: PreorderTableProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Reset selection when preorder list changes (e.g., pagination or filters change)
  useEffect(() => {
    setSelectedIds([]);
  }, [preorders]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(preorders.map((p) => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((item) => item !== id));
    }
  };

  const isAllSelected = preorders.length > 0 && selectedIds.length === preorders.length;
  const isSomeSelected = selectedIds.length > 0 && selectedIds.length < preorders.length;

  if (preorders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-xl border border-neutral-200 shadow-sm min-h-[350px]">
        <div className="p-4 bg-neutral-50 rounded-full text-neutral-400 mb-4 border border-neutral-100">
          <Inbox className="w-10 h-10" />
        </div>
        <h3 className="font-semibold text-neutral-900 text-lg mb-1">No Preorders Found</h3>
        <p className="text-neutral-500 text-sm max-w-sm mb-6 leading-relaxed">
          We couldn't find any preorder records matching your criteria. Try adjusting your filters or create a new preorder.
        </p>
        <Link
          href="/preorders/create"
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg shadow-sm transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> Create Preorder
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-neutral-50 border-b border-neutral-200 text-xs font-semibold text-neutral-500 select-none uppercase tracking-wider">
              {/* Checkbox Header */}
              <th className="py-4 px-4 w-12 text-center">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  ref={(el) => {
                    if (el) {
                      el.indeterminate = isSomeSelected;
                    }
                  }}
                  onChange={handleSelectAll}
                  className="w-4 h-4 text-neutral-900 border-neutral-300 rounded focus:ring-neutral-950 focus:ring-offset-0 transition cursor-pointer"
                  aria-label="Select all preorders"
                />
              </th>
              <th className="py-4 px-4 font-semibold text-neutral-600">Product Title</th>
              <th className="py-4 px-4 font-semibold text-neutral-600">SKU</th>
              <th className="py-4 px-4 font-semibold text-neutral-600">Customer</th>
              <th className="py-4 px-4 font-semibold text-neutral-600 text-right">Quantity</th>
              <th className="py-4 px-4 font-semibold text-neutral-600 text-right">Price</th>
              <th className="py-4 px-4 font-semibold text-neutral-600 text-center w-24">Status</th>
              <th className="py-4 px-4 font-semibold text-neutral-600">Created Date</th>
              <th className="py-4 px-4 font-semibold text-neutral-600 text-center w-28">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 text-sm text-neutral-700">
            {preorders.map((preorder) => {
              const isSelected = selectedIds.includes(preorder.id);
              return (
                <tr
                  key={preorder.id}
                  className={`hover:bg-neutral-50/70 transition-colors ${
                    isSelected ? "bg-neutral-50/50" : ""
                  }`}
                >
                  {/* Checkbox Cell */}
                  <td className="py-3 px-4 text-center">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => handleSelectOne(preorder.id, e.target.checked)}
                      className="w-4 h-4 text-neutral-900 border-neutral-300 rounded focus:ring-neutral-950 focus:ring-offset-0 transition cursor-pointer"
                      aria-label={`Select preorder for ${preorder.title}`}
                    />
                  </td>

                  {/* Title */}
                  <td className="py-3 px-4 font-medium text-neutral-900 max-w-xs truncate">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-neutral-400 shrink-0" />
                      <span title={preorder.title}>{preorder.title}</span>
                    </div>
                  </td>

                  {/* SKU */}
                  <td className="py-3 px-4 font-mono text-xs text-neutral-600">
                    {preorder.sku}
                  </td>

                  {/* Customer */}
                  <td className="py-3 px-4 text-neutral-700 font-medium truncate max-w-[150px]">
                    {preorder.customer}
                  </td>

                  {/* Quantity */}
                  <td className="py-3 px-4 text-right font-medium text-neutral-900">
                    {preorder.quantity}
                  </td>

                  {/* Price */}
                  <td className="py-3 px-4 text-right font-semibold text-neutral-950">
                    {formatCurrency(preorder.price)}
                  </td>

                  {/* Status Toggle Switch */}
                  <td className="py-3 px-4 text-center">
                    <div className="flex justify-center">
                      <StatusSwitch
                        id={preorder.id}
                        initialActive={preorder.active}
                        title={preorder.title}
                      />
                    </div>
                  </td>

                  {/* Created Date */}
                  <td className="py-3 px-4 text-xs text-neutral-500 whitespace-nowrap">
                    {formatDate(preorder.createdAt)}
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-center gap-1">
                      <Link
                        href={`/preorders/${preorder.id}/edit`}
                        className="p-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors border border-transparent"
                        title="Edit preorder"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Link>
                      <DeleteDialog id={preorder.id} title={preorder.title} />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
