import type { TaskPage } from "@/server/tasks/task.schema";

// Shared by the server prefetch in app/page.tsx and by TaskList, so both build
// the same infinite query and the browser reuses the page rendered on the server.
export const taskListInput = { limit: 10 };

export const taskListPaging = {
  // The cursor for the next request is the one the last page returned.
  // undefined tells TanStack Query there are no more pages.
  getNextPageParam: (lastPage: TaskPage) => lastPage.nextCursor ?? undefined,
};
