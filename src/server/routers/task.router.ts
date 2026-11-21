import { TRPCError } from "@trpc/server";
import { publicProcedure, router } from "../trpc";
import {
  createTaskInput,
  taskIdInput,
  updateTaskInput,
} from "../tasks/task.schema";

const notFound = (id: string) =>
  new TRPCError({ code: "NOT_FOUND", message: `Task ${id} not found` });

export const taskRouter = router({
  list: publicProcedure.query(({ ctx }) => ctx.store.list()),

  getById: publicProcedure.input(taskIdInput).query(({ ctx, input }) => {
    const task = ctx.store.get(input.id);
    if (!task) throw notFound(input.id);
    return task;
  }),

  create: publicProcedure
    .input(createTaskInput)
    .mutation(({ ctx, input }) => ctx.store.create(input)),

  update: publicProcedure.input(updateTaskInput).mutation(({ ctx, input }) => {
    const task = ctx.store.update(input);
    if (!task) throw notFound(input.id);
    return task;
  }),

  delete: publicProcedure.input(taskIdInput).mutation(({ ctx, input }) => {
    if (!ctx.store.delete(input.id)) throw notFound(input.id);
    return { id: input.id };
  }),
});
