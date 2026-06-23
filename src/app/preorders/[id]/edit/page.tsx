import { Suspense } from "react";
import Link from "next/link";
import { ArrowLeft, Edit, AlertCircle } from "lucide-react";
import { getPreorderById } from "@/lib/preorder-service";
import PreorderForm from "@/components/preorder/preorder-form";

// Exempt this dynamic parameters page from static prefetch validation
export const unstable_instant = false;

interface EditPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPreorderPage({ params }: EditPageProps) {
  return (
    <div className="flex-1 bg-neutral-50/50 min-h-screen py-12 px-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Decorative header */}
        <div className="flex items-center gap-3 justify-center mb-2">
          <div className="w-10 h-10 rounded-xl bg-neutral-950 text-white flex items-center justify-center shadow-sm">
            <Edit className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-neutral-950 tracking-tight">Edit Preorder Campaign</h1>
            <p className="text-xs text-neutral-400 font-medium">Modify and update current campaign fields</p>
          </div>
        </div>

        {/* Dynamic component wrapped in Suspense */}
        <Suspense fallback={<FormSkeleton />}>
          <EditPreorderContent params={params} />
        </Suspense>
      </div>
    </div>
  );
}

async function EditPreorderContent({ params }: { params: EditPageProps["params"] }) {
  const { id } = await params;
  const preorder = await getPreorderById(id);

  if (!preorder) {
    return (
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 text-center space-y-4">
        <div className="p-3 bg-rose-50 rounded-full text-rose-500 w-12 h-12 flex items-center justify-center mx-auto border border-rose-100">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="font-bold text-neutral-900 text-lg">Preorder Not Found</h2>
        <p className="text-neutral-500 text-sm leading-relaxed">
          The preorder record with ID <span className="font-mono text-neutral-700 font-semibold">{id}</span> does not exist or has been deleted.
        </p>
        <div className="pt-2">
          <Link
            href="/preorders"
            className="inline-flex items-center gap-1 text-xs font-semibold text-neutral-700 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200 px-4 py-2.5 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Preorders
          </Link>
        </div>
      </div>
    );
  }

  return <PreorderForm initialData={preorder} />;
}

// Skeleton component for form loading
function FormSkeleton() {
  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden p-6 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
        <div className="h-4 bg-neutral-100 rounded w-20 animate-pulse" />
        <div className="h-4 bg-neutral-100 rounded w-24 animate-pulse" />
      </div>
      <div className="space-y-4">
        <div className="h-4 bg-neutral-100 rounded w-1/4 animate-pulse" />
        <div className="h-10 bg-neutral-100 rounded w-full animate-pulse" />
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="h-4 bg-neutral-100 rounded w-1/3 animate-pulse" />
            <div className="h-10 bg-neutral-100 rounded w-full animate-pulse" />
          </div>
          <div>
            <div className="h-4 bg-neutral-100 rounded w-1/3 animate-pulse" />
            <div className="h-10 bg-neutral-100 rounded w-full animate-pulse" />
          </div>
        </div>
        <div className="h-10 bg-neutral-100 rounded w-full animate-pulse" />
      </div>
      <div className="flex justify-end gap-3 pt-4 border-t border-neutral-100">
        <div className="w-20 h-9 bg-neutral-100 rounded-lg animate-pulse" />
        <div className="w-28 h-9 bg-neutral-100 rounded-lg animate-pulse" />
      </div>
    </div>
  );
}
