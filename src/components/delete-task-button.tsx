"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTRPC } from "@/trpc/client";

export function DeleteTaskButton({ id }: { id: string }) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const deleteTask = useMutation(
    trpc.task.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          // pathKey matches every task.list query, including the infinite one.
          queryKey: trpc.task.list.pathKey(),
        });
        toast.success("Task deleted");
      },
      onError: (error) => {
        toast.error("Could not delete the task", {
          description: error.message,
        });
      },
    }),
  );

  return (
    <button
      type="button"
      onClick={() => deleteTask.mutate({ id })}
      disabled={deleteTask.isPending}
      className="shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium text-purple-600 transition-colors hover:bg-purple-50 focus-visible:ring-2 focus-visible:ring-purple-300 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
    >
      {deleteTask.isPending ? "Deleting…" : "Delete"}
    </button>
  );
}
