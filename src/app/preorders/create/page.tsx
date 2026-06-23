import { PackagePlus } from "lucide-react";
import PreorderForm from "@/components/preorder/preorder-form";

// Exempt this page from static prefetch validation
export const unstable_instant = false;

export default function CreatePreorderPage() {
  return (
    <div className="flex-1 bg-neutral-50/50 min-h-screen py-12 px-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Decorative header */}
        <div className="flex items-center gap-3 justify-center mb-2">
          <div className="w-10 h-10 rounded-xl bg-neutral-900 text-white flex items-center justify-center shadow-sm">
            <PackagePlus className="w-5.5 h-5.5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-neutral-950 tracking-tight">Add Campaign Record</h1>
            <p className="text-xs text-neutral-400 font-medium">Create a new customer preorder instance</p>
          </div>
        </div>

        {/* The React Hook Form with Zod validation */}
        <PreorderForm />
      </div>
    </div>
  );
}
