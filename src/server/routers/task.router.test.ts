import { TRPCError } from "@trpc/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createCallerFactory } from "../trpc";
import { TaskStore } from "../tasks/task.store";
import { appRouter } from "./_app";

const createCaller = createCallerFactory(appRouter);
const unknownId = "00000000-0000-4000-8000-000000000000";

let api: ReturnType<typeof createCaller>;

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-01-01T10:00:00Z"));
  api = createCaller({ store: new TaskStore() });
});

afterEach(() => {
  vi.useRealTimers();
});

const expectNotFound = (promise: Promise<unknown>) =>
  expect(promise).rejects.toMatchObject({ code: "NOT_FOUND" });

describe("task.create", () => {
  it("returns a new task with a uuid, completed false and timestamps", async () => {
    const task = await api.task.create({
      title: "  Buy milk  ",
      description: "Whole milk",
    });

    expect(task).toEqual({
      id: expect.stringMatching(/^[0-9a-f-]{36}$/),
      title: "Buy milk",
      description: "Whole milk",
      completed: false,
      createdAt: new Date("2026-01-01T10:00:00Z"),
      updatedAt: new Date("2026-01-01T10:00:00Z"),
    });
  });

  it("rejects an empty or whitespace-only title", async () => {
    await expect(api.task.create({ title: "" })).rejects.toThrow(TRPCError);
    await expect(api.task.create({ title: "   " })).rejects.toMatchObject({
      code: "BAD_REQUEST",
    });
    expect((await api.task.list({})).items).toEqual([]);
  });
});

describe("task.list", () => {
  it("returns tasks newest first", async () => {
    await api.task.create({ title: "First" });
    vi.advanceTimersByTime(1000);
    await api.task.create({ title: "Second" });

    const { items } = await api.task.list({});
    expect(items.map((task) => task.title)).toEqual(["Second", "First"]);
  });
});

describe("task.getById", () => {
  it("throws NOT_FOUND for an unknown id", async () => {
    await expectNotFound(api.task.getById({ id: unknownId }));
  });
});

describe("task.update", () => {
  it("changes the given fields and bumps updatedAt", async () => {
    const task = await api.task.create({ title: "Draft" });
    vi.advanceTimersByTime(1000);

    const updated = await api.task.update({
      id: task.id,
      title: "Final",
      completed: true,
    });

    expect(updated).toMatchObject({
      id: task.id,
      title: "Final",
      completed: true,
      createdAt: task.createdAt,
    });
    expect(updated.updatedAt.getTime()).toBeGreaterThan(
      task.updatedAt.getTime(),
    );
    expect(await api.task.getById({ id: task.id })).toEqual(updated);
  });

  it("throws NOT_FOUND for an unknown id", async () => {
    await expectNotFound(api.task.update({ id: unknownId, completed: true }));
  });
});

describe("task.delete", () => {
  it("removes the task, and deleting it again throws NOT_FOUND", async () => {
    const task = await api.task.create({ title: "Temporary" });

    await api.task.delete({ id: task.id });

    expect((await api.task.list({})).items).toEqual([]);
    await expectNotFound(api.task.delete({ id: task.id }));
  });
});
