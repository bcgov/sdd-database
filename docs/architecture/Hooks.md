# `src/hooks/` – Custom Hooks Architecture

All reusable state logic lives here. Hooks are categorized by function:

| Hook | Responsibility |
|------|----------------|
| `useEntityActions` | Central hub for UI + state management |
| `useSearch` | Manages search-related state and functions |
| `useEntityUIState` | Modal state control |
| `useEntityAlerts` | Success and error alerts |
| `useEntityEditCallbacks` | Callbacks for updating entity data |