# Actions Layer (`src/actions/`)

Thin intermediary layer between UI (and light business logic) and the Database layer.

## Responsibilities
- Defines Server Actions (entrypoints the UI calls)
- Validates/sanitizes input (light logic)
- Calls the Database layer for actual DB interaction
- Returns friendly, UI-safe results/errors

## Files
- `employees.ts` — employee actions
- `offices.ts` — office actions
- `search.ts` — shared search utilities