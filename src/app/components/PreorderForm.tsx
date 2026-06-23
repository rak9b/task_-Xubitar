"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createOrUpdatePreorder } from "@/lib/actions";

export default function PreorderForm({ initialData }: { initialData?: any }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [name, setName] = useState(initialData?.name || "");
  const [productCount, setProductCount] = useState(initialData?.productCount || 1);
  const [preorderWhen, setPreorderWhen] = useState(initialData?.preorderWhen || "regardless-of-stock");
  
  // Need to format dates for datetime-local input
  const formatForInput = (dateStr?: string | Date | null) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const offset = date.getTimezoneOffset() * 60000;
    const localISOTime = (new Date(date.getTime() - offset)).toISOString().slice(0, 16);
    return localISOTime;
  };

  const [startsAt, setStartsAt] = useState(formatForInput(initialData?.startsAt) || "");
  const [endsAt, setEndsAt] = useState(formatForInput(initialData?.endsAt) || "");
  const [status, setStatus] = useState(initialData?.status || "Active");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!name || !startsAt) {
       setError("Name and Starts At are required.");
       return;
    }

    startTransition(async () => {
      const result = await createOrUpdatePreorder({
        id: initialData?.id,
        name,
        productCount: Number(productCount),
        preorderWhen,
        startsAt: new Date(startsAt),
        endsAt: endsAt ? new Date(endsAt) : null,
        status,
      });

      if (result.success) {
        router.push("/");
      } else {
        setError(result.error || "Failed to save");
      }
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-neutral-200">
      <div className="flex items-center mb-6">
        <button 
          onClick={() => router.back()}
          className="text-sm text-neutral-500 hover:text-neutral-800 transition-colors"
        >
          ← Back
        </button>
      </div>
      
      <h1 className="text-2xl font-bold mb-6">{initialData ? "Edit Preorder" : "Create Preorder"}</h1>
      
      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Name *</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Product Count</label>
            <input 
              type="number" 
              min="1"
              value={productCount}
              onChange={(e) => setProductCount(parseInt(e.target.value) || 1)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Preorder When</label>
            <select 
              value={preorderWhen}
              onChange={(e) => setPreorderWhen(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 bg-white"
            >
              <option value="regardless-of-stock">regardless-of-stock</option>
              <option value="out-of-stock">out-of-stock</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Starts At *</label>
              <input 
                type="datetime-local" 
                value={startsAt}
                onChange={(e) => setStartsAt(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Ends At</label>
              <input 
                type="datetime-local" 
                value={endsAt}
                onChange={(e) => setEndsAt(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Status</label>
            <select 
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 bg-white"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-end space-x-4 pt-4 border-t border-neutral-100">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 text-sm font-medium text-neutral-700 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="px-4 py-2 text-sm font-medium text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors disabled:opacity-50 flex items-center"
          >
            {isPending ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
