import { Plus } from "lucide-react";
import Link from "next/link";
import { TaskList } from "@/components/task-list";
import { getQueryClient, HydrateClient, trpc } from "@/trpc/server";
import { taskListInput, taskListPaging } from "@/trpc/task-list";

// Tasks live in memory and change at runtime, so render on every request.
export const dynamic = "force-dynamic";

export default async function Home() {
  // Only the first page is rendered on the server. The browser loads the
  // rest while scrolling.
  await getQueryClient().prefetchInfiniteQuery(
    trpc.task.list.infiniteQueryOptions(taskListInput, taskListPaging),
  );

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-12 sm:py-16">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-purple-600">
            ArTask
          </h1>
          <p className="mt-1 text-slate-500">
            A simple place to keep track of your tasks.
          </p>
        </div>
        <Link
          href="/tasks/new"
          className="inline-flex items-center gap-1.5 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-purple-700 focus-visible:ring-2 focus-visible:ring-purple-300 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          <Plus size={16} aria-hidden="true" />
          Create task
        </Link>
      </header>

      <HydrateClient>
        <TaskList />
      </HydrateClient>
    </main>
  );
}
