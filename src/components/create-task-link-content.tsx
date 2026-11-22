"use client";

import { Loader2, Plus } from "lucide-react";
import { useLinkStatus } from "next/link";

// Rendered inside the "Create task" Link. useLinkStatus reports whether the
// navigation started by that Link is still loading.
export function CreateTaskLinkContent() {
  const { pending } = useLinkStatus();

  return (
    <span aria-busy={pending} className="inline-flex items-center gap-1.5">
      {pending ? (
        <Loader2 size={16} aria-hidden="true" className="animate-spin" />
      ) : (
        <Plus size={16} aria-hidden="true" />
      )}
      {pending ? "Opening…" : "Create task"}
    </span>
  );
}
