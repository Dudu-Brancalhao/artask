"use client";

import { Pencil } from "lucide-react";
import Link from "next/link";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import type { Task } from "@/server/tasks/task.schema";
import { useLoadMoreOnVisible } from "@/hooks/use-load-more-on-visible";
import { useTRPC } from "@/trpc/client";
import { taskListInput, taskListPaging } from "@/trpc/task-list";
import { DeleteTaskButton } from "./delete-task-button";
import { ToggleTaskButton } from "./toggle-task-button";

// A fixed locale and time zone give the same text on the server and in the
// browser, so hydration never sees a mismatch.
const dateFormat = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeZone: "UTC",
});

export function TaskList() {
  const trpc = useTRPC();
  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useSuspenseInfiniteQuery(
      trpc.task.list.infiniteQueryOptions(taskListInput, taskListPaging),
    );
  // Every loaded page is kept in data.pages. The list shows them all in order.
  const tasks = data.pages.flatMap((page) => page.items);
  const loadMoreRef = useLoadMoreOnVisible({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  });

  if (tasks.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-indigo-200 bg-white px-6 py-12 text-center">
        <p className="font-medium text-slate-700">No tasks yet</p>
        <p className="mt-1 text-sm text-slate-500">
          New tasks will show up here.
        </p>
      </div>
    );
  }

  return (
    <>
      <ul className="space-y-3">
        {tasks.map((task) => (
          <TaskItem key={task.id} task={task} />
        ))}
      </ul>
      <div
        ref={loadMoreRef}
        className="py-6 text-center text-sm text-slate-400"
      >
        {isFetchingNextPage && "Loading more…"}
        {!hasNextPage && data.pages.length > 1 && "You're all caught up"}
      </div>
    </>
  );
}

function TaskItem({ task }: { task: Task }) {
  return (
    <li className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-start gap-4">
        <div className="min-w-0 flex-1">
          <h2 className="font-medium break-words text-slate-900">
            {task.title}
          </h2>
          {task.description && (
            <p className="mt-1 text-sm break-words whitespace-pre-line text-slate-600">
              {task.description}
            </p>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <Link
            href={`/tasks/${task.id}/edit`}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-indigo-600 transition-colors hover:bg-indigo-50 focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:outline-none"
          >
            <Pencil size={16} aria-hidden="true" />
            Edit
          </Link>
          <DeleteTaskButton id={task.id} />
        </div>
      </div>
      <div className="mt-3 flex items-center gap-3">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-3 gap-y-1 text-xs">
          <StatusBadge completed={task.completed} />
          <span className="text-slate-400">
            Created {dateFormat.format(task.createdAt)}
          </span>
        </div>
        <ToggleTaskButton id={task.id} completed={task.completed} />
      </div>
    </li>
  );
}

function StatusBadge({ completed }: { completed: boolean }) {
  return completed ? (
    <span className="rounded-full bg-green-100 px-2.5 py-0.5 font-medium text-green-700">
      Completed
    </span>
  ) : (
    <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 font-medium text-indigo-500">
      Pending
    </span>
  );
}
