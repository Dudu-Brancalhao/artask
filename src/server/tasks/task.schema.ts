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

const title = z.string().trim().min(1, "Title is required").max(120);
const description = z.string().trim().max(1000);

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
