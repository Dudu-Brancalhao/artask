import { TRPCError } from "@trpc/server";
import { notFound } from "next/navigation";
import { TaskForm } from "@/components/task-form";
import { getQueryClient, HydrateClient, trpc } from "@/trpc/server";

export const dynamic = "force-dynamic";

export default async function EditTaskPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const task = await getQueryClient()
    .fetchQuery(trpc.task.getById.queryOptions({ id }))
    .catch((error: unknown) => {
      // An unknown id, or one that is not even a UUID, has no task to edit.
      if (
        error instanceof TRPCError &&
        (error.code === "NOT_FOUND" || error.code === "BAD_REQUEST")
      ) {
        notFound();
      }
      throw error;
    });

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-12 sm:py-16">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-purple-600">
          Edit task
        </h1>
        <p className="mt-1 text-slate-500">Update the details of this task.</p>
      </header>

      <HydrateClient>
        <TaskForm task={task} />
      </HydrateClient>
    </main>
  );
}
