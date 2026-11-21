import type { CreateTaskInput, Task, UpdateTaskInput } from "./task.schema";

export class TaskStore {
  private readonly tasks = new Map<string, Task>();

  list(): Task[] {
    return [...this.tasks.values()].sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    );
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
