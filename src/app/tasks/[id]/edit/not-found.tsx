import Link from "next/link";

export default function TaskNotFound() {
  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-12 sm:py-16">
      <div className="rounded-2xl border border-dashed border-indigo-200 bg-white px-6 py-12 text-center">
        <p className="font-medium text-slate-700">Task not found</p>
        <p className="mt-1 text-sm text-slate-500">
          It may have been deleted, or the link is wrong.
        </p>
        <Link
          href="/"
          className="mt-5 inline-block rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          Back to tasks
        </Link>
      </div>
    </main>
  );
}
