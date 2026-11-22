"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useTRPC } from "@/trpc/client";

export function ToggleTaskButton({
  id,
  completed,
}: {
  id: string;
  completed: boolean;
}) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const toggleTask = useMutation(
    trpc.task.update.mutationOptions({
      onSuccess: async (task) => {
        await queryClient.invalidateQueries({
          queryKey: trpc.task.list.pathKey(),
        });
        toast.success(
          task.completed ? "Task marked as done" : "Task marked as pending",
        );
      },
      onError: (error) => {
        toast.error("Could not update the task", {
          description: error.message,
        });
      },
    }),
  );
  const label = completed ? "Mark as pending" : "Mark as done";

  return (
    <button
      type="button"
      onClick={() => toggleTask.mutate({ id, completed: !completed })}
      disabled={toggleTask.isPending}
      aria-label={label}
      aria-pressed={completed}
      className={`group relative inline-flex size-8 shrink-0 items-center justify-center rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-green-300 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${
        completed
          ? "bg-green-600 text-white hover:bg-green-700"
          : "text-green-600 hover:bg-green-50"
      }`}
    >
      {toggleTask.isPending ? (
        <Loader2 size={16} aria-hidden="true" className="animate-spin" />
      ) : (
        <Check size={16} aria-hidden="true" />
      )}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-0 bottom-full z-10 mb-2 rounded-md bg-slate-900 px-2 py-1 text-xs font-medium whitespace-nowrap text-white opacity-0 shadow transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
      >
        {label}
      </span>
    </button>
  );
}
