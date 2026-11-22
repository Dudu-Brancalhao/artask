import { TaskForm } from "@/components/task-form";

export const dynamic = "force-dynamic";

export default function NewTaskPage() {
  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-12 sm:py-16">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-purple-600">
          New task
        </h1>
        <p className="mt-1 text-slate-500">Add something to your list.</p>
      </header>

      <TaskForm />
    </main>
  );
}
