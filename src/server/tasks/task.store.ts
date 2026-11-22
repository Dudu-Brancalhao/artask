import type {
  CreateTaskInput,
  ListTasksInput,
  Task,
  TaskPage,
  UpdateTaskInput,
} from "./task.schema";

export class TaskStore {
  private readonly tasks = new Map<string, Task>();

  // Newest first. Tasks created in the same millisecond are ordered by id, so
  // the order never changes between two requests.
  list(): Task[] {
    return [...this.tasks.values()].sort(
      (a, b) =>
        b.createdAt.getTime() - a.createdAt.getTime() ||
        a.id.localeCompare(b.id),
    );
  }

  // Returns the `limit` tasks that come right after the cursor task. Because
  // the cursor is a task id rather than a position, tasks created or deleted
  // in the meantime do not shift the next page. Returns undefined when the
  // cursor task no longer exists.
  listPage({ limit, cursor }: ListTasksInput): TaskPage | undefined {
    const tasks = this.list();
    let start = 0;
    if (cursor) {
      const index = tasks.findIndex((task) => task.id === cursor);
      if (index === -1) return undefined;
      start = index + 1;
    }
    const items = tasks.slice(start, start + limit);
    const hasMore = start + limit < tasks.length;
    return { items, nextCursor: hasMore ? items[items.length - 1].id : null };
  }

  get(id: string): Task | undefined {
    return this.tasks.get(id);
  }

  create(input: CreateTaskInput): Task {
    const now = new Date();
    const task: Task = {
      id: crypto.randomUUID(),
      title: input.title,
      description: input.description,
      completed: false,
      createdAt: now,
      updatedAt: now,
    };
    this.tasks.set(task.id, task);
    return task;
  }

  update({ id, ...changes }: UpdateTaskInput): Task | undefined {
    const current = this.tasks.get(id);
    if (!current) return undefined;
    const updated: Task = {
      ...current,
      ...Object.fromEntries(
        Object.entries(changes).filter(([, value]) => value !== undefined),
      ),
      updatedAt: new Date(),
    };
    this.tasks.set(id, updated);
    return updated;
  }

  delete(id: string): boolean {
    return this.tasks.delete(id);
  }
}

// Next.js dev hot reload re-evaluates modules, which would create a new empty
// store on every edit. Keeping the instance on globalThis preserves the tasks.
const globalForStore = globalThis as unknown as { taskStore?: TaskStore };

export const taskStore = (globalForStore.taskStore ??= new TaskStore());
