# Decisions

## Modeling

- Changed "dataCriacao" to "createdAt" for convention.
- UUIDs instead of incremental IDs.
- Added "updatedAt" and "completed" just to have the option to mark as done.
- No userId until there's no authentication.

## CRUD procedures

Added 5 procedures: list, getById, create, update, delete, validated with Zod. A missing ID returns a proper "not found" error.

## Validations/Error treatment

- Shared Zod schema for client and server validation (that's the best benefit from tRPC).
- Inline field errors for validations on specific fields
- Toast for api responses, such as created, updated, not found, network or server error (I choose sonner since it's a light lib).
- Unknown update fields silently get stripped (Zod default).

List of errors:
- Creating a task with empty title is rejected
- getById missing id returns NOT_FOUND
- getById with an invalid ID format (not UUID) returns BAD_REQUEST
- delete non existing id returns NOT_FOUND
- update non existing id returns NOT_FOUND
- title over 120 characters or a description over 1000 returns BAD_REQUEST
- a whitespace-only title is trimmed and then rejected

## Pagination

- Cursor pagination instead of offset.