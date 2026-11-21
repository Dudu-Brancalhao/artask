# ArTask

ArTask is a Next.js 15 app that simulates a task management application. The backend keeps the task list in memory and exposes it through tRPC.

## Stack

- [Next.js 15](https://nextjs.org) (App Router) with React 19
- TypeScript
- Tailwind CSS
- ESLint and Prettier

## Requirements

- Node.js 20 or newer
- pnpm (the version is pinned in `package.json`; `corepack enable` will pick it up)

## Getting started

```bash
pnpm install
pnpm dev
```

Then open http://localhost:3000.

## Scripts

| Command          | What it does                     |
| ---------------- | -------------------------------- |
| `pnpm dev`       | Start the dev server (Turbopack) |
| `pnpm build`     | Build for production             |
| `pnpm start`     | Run the production build         |
| `pnpm lint`      | Lint with ESLint                 |
| `pnpm typecheck` | Type-check with TypeScript       |
| `pnpm format`    | Format the code with Prettier    |
