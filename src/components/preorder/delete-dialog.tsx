"use client";

import { useState, useTransition, useEffect } from "react";
import { Trash2, AlertTriangle, X } from "lucide-react";
import { deletePreorderAction } from "@/actions/preorder-actions";
import { useToast } from "@/components/ui/toast";

interface DeleteDialogProps {
  id: string;
  title: string;
}

export default function DeleteDialog({ id, title }: DeleteDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  // Close modal on escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deletePreorderAction(id);
      if (result.success) {
        toast({
          title: "Preorder Deleted",
          description: `"${title}" has been successfully deleted.`,
          type: "success",
        });
        setIsOpen(false);
      } else {
        toast({
          title: "Deletion Failed",
          description: result.error || "Failed to delete preorder.",
          type: "error",
        });
      }
    });
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 text-neutral-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-100"
        title={`Delete preorder for ${title}`}
      >
        <Trash2 className="w-4 h-4" />
      </button>

      {/* Modal Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
            onClick={() => !isPending && setIsOpen(false)}
          />

          {/* Dialog Panel */}
          <div className="relative bg-white w-full max-w-md rounded-2xl shadow-xl border border-neutral-200 overflow-hidden z-10 animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0" />
                <h3 className="font-semibold text-neutral-950 text-base">Delete Preorder</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                disabled={isPending}
                className="text-neutral-400 hover:text-neutral-600 rounded p-1 hover:bg-neutral-50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <p className="text-sm text-neutral-600 leading-relaxed">
                Are you sure you want to delete the preorder for{" "}
                <span className="font-semibold text-neutral-900">"{title}"</span>? This action
                is permanent and cannot be undone.
              </p>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 bg-neutral-50 border-t border-neutral-100">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                disabled={isPending}
                className="px-4 py-2 text-xs font-semibold text-neutral-700 hover:text-neutral-900 bg-white hover:bg-neutral-50 border border-neutral-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isPending}
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm disabled:opacity-50"
              >
                {isPending ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete Preorder"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
