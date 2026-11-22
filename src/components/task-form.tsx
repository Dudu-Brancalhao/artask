"use client";

import type { TRPCClientErrorLike } from "@trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import type { AppRouter } from "@/server/routers/_app";
import { createTaskInput, type Task } from "@/server/tasks/task.schema";
import { useTRPC } from "@/trpc/client";

type Field = "title" | "description";
type FieldErrors = Partial<Record<Field, string>>;

const fields: Field[] = ["title", "description"];

// Keeps the first message of each known field, so errors from the client
// schema and from the server end up in the same shape.
function toFieldErrors(
  fieldErrors: Partial<Record<string, string[] | undefined>>,
): FieldErrors {
  const errors: FieldErrors = {};
  for (const field of fields) {
    const message = fieldErrors[field]?.[0];
    if (message) errors[field] = message;
  }
  return errors;
}

export function TaskForm({ task }: { task?: Task }) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const router = useRouter();
  const id = useId();

  const [title, setTitle] = useState(task?.title ?? "");
  const [description, setDescription] = useState(task?.description ?? "");
  const [completed, setCompleted] = useState(task?.completed ?? false);
  const [errors, setErrors] = useState<FieldErrors>({});

  const onSuccess = async (message: string) => {
    await queryClient.invalidateQueries({
      queryKey: trpc.task.list.pathKey(),
    });
    if (task) {
      await queryClient.invalidateQueries({
        queryKey: trpc.task.getById.queryKey({ id: task.id }),
      });
    }
    toast.success(message);
    router.push("/");
  };

  // Field errors from the server go under their fields; anything else (not
  // found, network or server errors) is reported once, as a toast.
  const onError = (heading: string, error: TRPCClientErrorLike<AppRouter>) => {
    const serverErrors = toFieldErrors(error.data?.zodError?.fieldErrors ?? {});
    if (Object.keys(serverErrors).length > 0) {
      setErrors(serverErrors);
      return;
    }
    toast.error(heading, { description: error.message });
  };

  const createTask = useMutation(
    trpc.task.create.mutationOptions({
      onSuccess: () => onSuccess("Task created"),
      onError: (error) => onError("Could not create the task", error),
    }),
  );
  const updateTask = useMutation(
    trpc.task.update.mutationOptions({
      onSuccess: () => onSuccess("Task updated"),
      onError: (error) => onError("Could not update the task", error),
    }),
  );
  const isPending = createTask.isPending || updateTask.isPending;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Same schema the server validates with, so both sides agree on the rules.
    const result = createTaskInput.safeParse({ title, description });
    if (!result.success) {
      setErrors(toFieldErrors(z.flattenError(result.error).fieldErrors));
      return;
    }
    setErrors({});

    if (task) {
      // An empty description is sent as "", which clears it on the server.
      updateTask.mutate({ id: task.id, ...result.data, completed });
    } else {
      createTask.mutate({
        title: result.data.title,
        description: result.data.description || undefined,
      });
    }
  };

  const clearError = (field: Field) =>
    setErrors((current) => ({ ...current, [field]: undefined }));

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
    >
      <div>
        <label
          htmlFor={`${id}-title`}
          className="block text-sm font-medium text-slate-700"
        >
          Title
        </label>
        <input
          id={`${id}-title`}
          name="title"
          type="text"
          value={title}
          onChange={(event) => {
            setTitle(event.target.value);
            clearError("title");
          }}
          aria-invalid={errors.title ? true : undefined}
          aria-describedby={errors.title ? `${id}-title-error` : undefined}
          className={inputClassName}
        />
        <FieldError id={`${id}-title-error`} message={errors.title} />
      </div>

      <div>
        <label
          htmlFor={`${id}-description`}
          className="block text-sm font-medium text-slate-700"
        >
          Description{" "}
          <span className="font-normal text-slate-400">(optional)</span>
        </label>
        <textarea
          id={`${id}-description`}
          name="description"
          rows={4}
          value={description}
          onChange={(event) => {
            setDescription(event.target.value);
            clearError("description");
          }}
          aria-invalid={errors.description ? true : undefined}
          aria-describedby={
            errors.description ? `${id}-description-error` : undefined
          }
          className={`${inputClassName} resize-y`}
        />
        <FieldError
          id={`${id}-description-error`}
          message={errors.description}
        />
      </div>

      {task && (
        <div className="flex items-center gap-2">
          <input
            id={`${id}-completed`}
            name="completed"
            type="checkbox"
            checked={completed}
            onChange={(event) => setCompleted(event.target.checked)}
            className="size-4 rounded border-slate-300 accent-indigo-600 focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:outline-none"
          />
          <label
            htmlFor={`${id}-completed`}
            className="text-sm font-medium text-slate-700"
          >
            Completed
          </label>
        </div>
      )}

      <div className="flex flex-col-reverse gap-3 pt-1 sm:flex-row sm:justify-end">
        <Link
          href="/"
          className="rounded-lg px-4 py-2 text-center text-sm font-medium text-indigo-600 transition-colors hover:bg-indigo-50 focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:outline-none"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Saving…" : task ? "Save changes" : "Create task"}
        </button>
      </div>
    </form>
  );
}

const inputClassName =
  "mt-1.5 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-xs placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 focus:outline-none aria-invalid:border-red-400 aria-invalid:focus:ring-red-100";

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1.5 text-sm text-red-600">
      {message}
    </p>
  );
}
