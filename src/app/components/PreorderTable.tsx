"use client";

import { useTransition, useState } from "react";
import { Preorder } from "@prisma/client";
import { toggleStatus, deletePreorder } from "@/lib/actions";
import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";

const formatDate = (date: Date | null) => {
  if (!date) return "";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
};

export default function PreorderTable({ preorders }: { preorders: Preorder[] }) {
  const [isPending, startTransition] = useTransition();
  const [actionId, setActionId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(new Set(preorders.map((p) => p.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectOne = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleToggleStatus = (id: string, currentStatus: string) => {
    setActionId(`toggle-${id}`);
    startTransition(async () => {
      await toggleStatus(id, currentStatus);
      setActionId(null);
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this preorder?")) {
      setActionId(`delete-${id}`);
      startTransition(async () => {
        await deletePreorder(id);
        setActionId(null);
      });
    }
  };

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-neutral-500 border-b border-neutral-200 bg-white">
            <tr>
              <th scope="col" className="p-4 w-4">
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    checked={preorders.length > 0 && selectedIds.size === preorders.length}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900" 
                  />
                </div>
              </th>
              <th scope="col" className="px-6 py-4 font-semibold text-neutral-700">Name</th>
              <th scope="col" className="px-6 py-4 font-semibold text-neutral-700">Products</th>
              <th scope="col" className="px-6 py-4 font-semibold text-neutral-700">Preorder when</th>
              <th scope="col" className="px-6 py-4 font-semibold text-neutral-700">Starts at</th>
              <th scope="col" className="px-6 py-4 font-semibold text-neutral-700">Ends at</th>
              <th scope="col" className="px-6 py-4 font-semibold text-neutral-700">Status</th>
              <th scope="col" className="px-6 py-4 font-semibold text-neutral-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 bg-white">
            {preorders.map((preorder) => {
              const isToggling = isPending && actionId === `toggle-${preorder.id}`;
              const isDeleting = isPending && actionId === `delete-${preorder.id}`;
              const isActive = preorder.status === "Active";

              return (
                <tr key={preorder.id} className={`${isDeleting ? 'opacity-50' : ''} hover:bg-neutral-50/50 transition-colors`}>
                  <td className="p-4 w-4">
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        checked={selectedIds.has(preorder.id)}
                        onChange={() => handleSelectOne(preorder.id)}
                        className="w-4 h-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900" 
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 font-semibold text-neutral-900">{preorder.name}</td>
                  <td className="px-6 py-4 text-neutral-600">{preorder.productCount}</td>
                  <td className="px-6 py-4 text-neutral-600">{preorder.preorderWhen}</td>
                  <td className="px-6 py-4 text-neutral-600">{formatDate(preorder.startsAt)}</td>
                  <td className="px-6 py-4 text-neutral-600">{formatDate(preorder.endsAt)}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleToggleStatus(preorder.id, preorder.status)}
                      disabled={isPending}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2 ${
                        isActive ? "bg-neutral-900" : "bg-neutral-200"
                      } ${isToggling ? "opacity-50" : ""}`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          isActive ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <Link
                        href={`/edit/${preorder.id}`}
                        className="p-1.5 border border-neutral-200 rounded text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50 transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(preorder.id)}
                        disabled={isPending}
                        className="p-1.5 border border-neutral-200 rounded text-neutral-500 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            
            {preorders.length === 0 && (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center text-neutral-500">
                  No preorders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
