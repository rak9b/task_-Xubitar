"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { preorderSchema, PreorderFormValues } from "@/lib/validations";
import { createPreorderAction, updatePreorderAction } from "@/actions/preorder-actions";
import { useToast } from "@/components/ui/toast";

interface PreorderFormProps {
  initialData?: {
    id: string;
    title: string;
    sku: string;
    customer: string;
    quantity: number;
    price: number;
    description: string | null;
    active: boolean;
  };
}

export default function PreorderForm({ initialData }: PreorderFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const isEditMode = !!initialData;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PreorderFormValues>({
    resolver: zodResolver(preorderSchema),
    defaultValues: {
      title: initialData?.title || "",
      sku: initialData?.sku || "",
      customer: initialData?.customer || "",
      quantity: initialData?.quantity || 1,
      price: initialData?.price || 0.01,
      description: initialData?.description || "",
      active: initialData?.active ?? true,
    },
  });

  const onSubmit = (data: PreorderFormValues) => {
    startTransition(async () => {
      let result;
      if (isEditMode && initialData) {
        result = await updatePreorderAction(initialData.id, data);
      } else {
        result = await createPreorderAction(data);
      }

      if (result.success) {
        toast({
          title: isEditMode ? "Preorder Updated" : "Preorder Created",
          description: `Preorder for "${data.title}" saved successfully.`,
          type: "success",
        });
        router.push("/preorders");
        router.refresh();
      } else {
        toast({
          title: "Save Failed",
          description: result.error || "An error occurred while saving the preorder.",
          type: "error",
        });
      }
    });
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Form Header */}
      <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
        <button
          type="button"
          onClick={() => router.push("/preorders")}
          className="flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to List
        </button>
        <span className="text-xs font-medium text-neutral-400">
          {isEditMode ? "Edit Preorder Campaign" : "New Campaign"}
        </span>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
        <h2 className="text-xl font-bold text-neutral-950">
          {isEditMode ? "Update Preorder Details" : "Create New Preorder"}
        </h2>

        <div className="space-y-4">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-xs font-semibold text-neutral-600 mb-1.5 uppercase tracking-wider">
              Product Title <span className="text-rose-500">*</span>
            </label>
            <input
              id="title"
              type="text"
              placeholder="e.g. iPhone 15 Pro Max Silicon Case"
              {...register("title")}
              className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-xl outline-none transition-all focus:ring-1 focus:ring-neutral-950 ${
                errors.title
                  ? "border-rose-300 focus:border-rose-500"
                  : "border-neutral-200 focus:border-neutral-950"
              }`}
            />
            {errors.title && (
              <p className="mt-1.5 text-xs text-rose-500 font-medium">{errors.title.message}</p>
            )}
          </div>

          {/* SKU and Customer Name Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* SKU */}
            <div>
              <label htmlFor="sku" className="block text-xs font-semibold text-neutral-600 mb-1.5 uppercase tracking-wider">
                SKU <span className="text-rose-500">*</span>
              </label>
              <input
                id="sku"
                type="text"
                placeholder="e.g. CASE-15PM-SIL"
                {...register("sku")}
                className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-xl outline-none font-mono transition-all focus:ring-1 focus:ring-neutral-950 ${
                  errors.sku
                    ? "border-rose-300 focus:border-rose-500"
                    : "border-neutral-200 focus:border-neutral-950"
                }`}
              />
              {errors.sku && (
                <p className="mt-1.5 text-xs text-rose-500 font-medium">{errors.sku.message}</p>
              )}
            </div>

            {/* Customer */}
            <div>
              <label htmlFor="customer" className="block text-xs font-semibold text-neutral-600 mb-1.5 uppercase tracking-wider">
                Customer Name <span className="text-rose-500">*</span>
              </label>
              <input
                id="customer"
                type="text"
                placeholder="e.g. John Doe"
                {...register("customer")}
                className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-xl outline-none transition-all focus:ring-1 focus:ring-neutral-950 ${
                  errors.customer
                    ? "border-rose-300 focus:border-rose-500"
                    : "border-neutral-200 focus:border-neutral-950"
                }`}
              />
              {errors.customer && (
                <p className="mt-1.5 text-xs text-rose-500 font-medium">{errors.customer.message}</p>
              )}
            </div>
          </div>

          {/* Quantity and Price Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Quantity */}
            <div>
              <label htmlFor="quantity" className="block text-xs font-semibold text-neutral-600 mb-1.5 uppercase tracking-wider">
                Quantity <span className="text-rose-500">*</span>
              </label>
              <input
                id="quantity"
                type="number"
                min="1"
                step="1"
                placeholder="e.g. 1"
                {...register("quantity", { valueAsNumber: true })}
                className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-xl outline-none transition-all focus:ring-1 focus:ring-neutral-950 ${
                  errors.quantity
                    ? "border-rose-300 focus:border-rose-500"
                    : "border-neutral-200 focus:border-neutral-950"
                }`}
              />
              {errors.quantity && (
                <p className="mt-1.5 text-xs text-rose-500 font-medium">{errors.quantity.message}</p>
              )}
            </div>

            {/* Price */}
            <div>
              <label htmlFor="price" className="block text-xs font-semibold text-neutral-600 mb-1.5 uppercase tracking-wider">
                Price ($) <span className="text-rose-500">*</span>
              </label>
              <input
                id="price"
                type="number"
                min="0.01"
                step="0.01"
                placeholder="e.g. 29.99"
                {...register("price", { valueAsNumber: true })}
                className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-xl outline-none transition-all focus:ring-1 focus:ring-neutral-950 ${
                  errors.price
                    ? "border-rose-300 focus:border-rose-500"
                    : "border-neutral-200 focus:border-neutral-950"
                }`}
              />
              {errors.price && (
                <p className="mt-1.5 text-xs text-rose-500 font-medium">{errors.price.message}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-xs font-semibold text-neutral-600 mb-1.5 uppercase tracking-wider">
              Description <span className="text-neutral-400 font-normal">(Optional)</span>
            </label>
            <textarea
              id="description"
              rows={3}
              placeholder="Provide a brief summary or notes for this preorder..."
              {...register("description")}
              className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-xl outline-none resize-none transition-all focus:ring-1 focus:ring-neutral-950 ${
                errors.description
                  ? "border-rose-300 focus:border-rose-500"
                  : "border-neutral-200 focus:border-neutral-950"
              }`}
            />
            {errors.description && (
              <p className="mt-1.5 text-xs text-rose-500 font-medium">{errors.description.message}</p>
            )}
          </div>

          {/* Active Switch */}
          <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl border border-neutral-200/60">
            <div>
              <span className="block text-xs font-semibold text-neutral-800 uppercase tracking-wider">
                Campaign Active Status
              </span>
              <span className="text-[11px] text-neutral-400">
                Inactive preorders will not be listed in active filters.
              </span>
            </div>
            <div className="flex items-center">
              <input
                id="active"
                type="checkbox"
                {...register("active")}
                className="w-5 h-5 text-neutral-900 border-neutral-300 rounded focus:ring-neutral-950 focus:ring-offset-0 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-100">
          <button
            type="button"
            onClick={() => router.push("/preorders")}
            disabled={isPending}
            className="px-4 py-2 text-xs font-semibold text-neutral-700 hover:text-neutral-950 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="px-4 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-50"
          >
            {isPending ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                {isEditMode ? "Save Updates" : "Create Campaign"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
