"use client";

import type { ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { useLinkStatus } from "next/link";

type LinkPendingContentProps = {
  icon: ReactNode;
  label: ReactNode;
  pendingLabel: ReactNode;
};

// Rendered inside a Link. useLinkStatus reports whether the navigation started
// by that Link is still loading, so only the clicked Link shows the spinner.
export function LinkPendingContent({
  icon,
  label,
  pendingLabel,
}: LinkPendingContentProps) {
  const { pending } = useLinkStatus();

  return (
    <span aria-busy={pending} className="inline-flex items-center gap-1.5">
      {pending ? (
        <Loader2 size={16} aria-hidden="true" className="animate-spin" />
      ) : (
        icon
      )}
      {pending ? pendingLabel : label}
    </span>
  );
}
