import { z } from "zod";

export const taskSchema = z.object({
  id: z.uuid(),
  title: z.string(),
  description: z.string().optional(),
  completed: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Task = z.infer<typeof taskSchema>;

const title = z
  .string()
  .trim()
  .min(1, "Title is required")
  .max(120, "Title must be 120 characters or fewer");
const description = z
  .string()
  .trim()
  .max(1000, "Description must be 1000 characters or fewer");

export const createTaskInput = z.object({
  title,
  description: description.optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskInput>;

export const updateTaskInput = z
  .object({
    id: z.uuid(),
    title: title.optional(),
    description: description.optional(),
    completed: z.boolean().optional(),
  })
  .refine(
    ({ title, description, completed }) =>
      title !== undefined ||
      description !== undefined ||
      completed !== undefined,
    { message: "Provide at least one field to update" },
  );

export type UpdateTaskInput = z.infer<typeof updateTaskInput>;

export const taskIdInput = z.object({ id: z.uuid() });

export const listTasksInput = z.object({
  limit: z.number().int().min(1).max(50).default(10),
  // The id of the last task of the previous page. Missing on the first page.
  cursor: z.uuid().nullish(),
});

export type ListTasksInput = z.infer<typeof listTasksInput>;

export type TaskPage = { items: Task[]; nextCursor: string | null };
