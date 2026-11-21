import { TaskList } from "@/components/task-list";
import { getQueryClient, HydrateClient, trpc } from "@/trpc/server";

// Tasks live in memory and change at runtime, so render on every request.
export const dynamic = "force-dynamic";

export default async function Home() {
  await getQueryClient().prefetchQuery(trpc.task.list.queryOptions());

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-12 sm:py-16">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-purple-600">
          ArTask
        </h1>
        <p className="mt-1 text-slate-500">
          A simple place to keep track of your tasks.
        </p>
      </header>

      <HydrateClient>
        <TaskList />
      </HydrateClient>
    </main>
  );
}
