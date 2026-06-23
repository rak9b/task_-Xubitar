"use client";

import { useState, useTransition } from "react";
import { togglePreorderStatusAction } from "@/actions/preorder-actions";
import { useToast } from "@/components/ui/toast";

interface StatusSwitchProps {
  id: string;
  initialActive: boolean;
  title: string;
}

export default function StatusSwitch({ id, initialActive, title }: StatusSwitchProps) {
  const [active, setActive] = useState(initialActive);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleToggle = () => {
    // 1. Optimistic update
    const previousState = active;
    setActive(!previousState);

    // 2. Call Server Action in transition
    startTransition(async () => {
      const result = await togglePreorderStatusAction(id);
      
      if (result.success) {
        toast({
          title: "Status Updated",
          description: `"${title}" status changed to ${!previousState ? "Active" : "Inactive"}.`,
          type: "success",
        });
      } else {
        // Revert on error
        setActive(previousState);
        toast({
          title: "Failed to Update Status",
          description: result.error || "An error occurred while updating the status.",
          type: "error",
        });
      }
    });
  };

  return (
    <div className="flex items-center">
      <button
        type="button"
        onClick={handleToggle}
        disabled={isPending}
        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 disabled:opacity-60 ${
          active ? "bg-emerald-500" : "bg-neutral-300"
        }`}
        role="switch"
        aria-checked={active}
        aria-label={`Toggle active status for ${title}`}
      >
        <span
          aria-hidden="true"
          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
            active ? "translate-x-4" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}
