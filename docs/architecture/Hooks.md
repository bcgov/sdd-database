# `src/hooks/` – Custom Hooks Architecture

All reusable state logic lives here. Each hook handles one concern, keeping `page.tsx` clean and declarative.

---

## 🧭 Overview of Hooks and Responsibilities

| Hook                      | Responsibility                                                                 |
|---------------------------|---------------------------------------------------------------------------------|
| `useEntityOrchestration`  | Composes all hooks and exposes only what the page needs (`uiState`, `alerts`, `search`, `actions`, `editHandlers`). |
| `useEntityActions`        | Handles entity-specific logic: opening modals, assign office flow, optimistic deletes, and success/error handlers. |
| `useSearch`               | Manages search state: phrase, filters, results, optimistic updates, and refresh logic. |
| `useEntityUIState`        | Simple modal state (`isEditModalOpen`, `setIsEditModalOpen`).                    |
| `useEntityAlerts`         | Alert state with helpers for success/error messages (auto-hide for success).     |
| `useEntityEditCallbacks`  | Provides edit success/error handlers: refresh results, close modal, show alerts. |

---