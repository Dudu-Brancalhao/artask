"use client";

import Link from "next/link";
import { useSuspenseQuery } from "@tanstack/react-query";
import type { Task } from "@/server/tasks/task.schema";
import { useTRPC } from "@/trpc/client";
import { DeleteTaskButton } from "./delete-task-button";

// A fixed locale and time zone give the same text on the server and in the
// browser, so hydration never sees a mismatch.
const dateFormat = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeZone: "UTC",
});

export function TaskList() {
  const trpc = useTRPC();
  const { data: tasks } = useSuspenseQuery(trpc.task.list.queryOptions());

  if (tasks.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-purple-200 bg-white px-6 py-12 text-center">
        <p className="font-medium text-slate-700">No tasks yet</p>
        <p className="mt-1 text-sm text-slate-500">
          New tasks will show up here.
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </ul>
  );
}

function TaskItem({ task }: { task: Task }) {
  return (
    <li className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="min-w-0 flex-1">
        <h2 className="font-medium break-words text-slate-900">{task.title}</h2>
        {task.description && (
          <p className="mt-1 text-sm break-words whitespace-pre-line text-slate-600">
            {task.description}
          </p>
        )}
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
          <StatusBadge completed={task.completed} />
          <span className="text-slate-400">
            Created {dateFormat.format(task.createdAt)}
          </span>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <Link
          href={`/tasks/${task.id}/edit`}
          className="rounded-lg px-3 py-1.5 text-sm font-medium text-purple-600 transition-colors hover:bg-purple-50 focus-visible:ring-2 focus-visible:ring-purple-300 focus-visible:outline-none"
        >
          Edit
        </Link>
        <DeleteTaskButton id={task.id} />
      </div>
    </li>
  );
}

function StatusBadge({ completed }: { completed: boolean }) {
  return completed ? (
    <span className="rounded-full bg-purple-100 px-2.5 py-0.5 font-medium text-purple-700">
      Completed
    </span>
  ) : (
    <span className="rounded-full bg-purple-50 px-2.5 py-0.5 font-medium text-purple-500">
      Pending
    </span>
  );
}
