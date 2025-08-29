# `src/app/page.tsx` – Main Application Page

This is the entry point and UI composition layer of the app.  
It stays lean by consuming all state and logic through `useEntityOrchestration`.

---

## 📌 Responsibilities
- Provides the **overall layout** (Header, Footer, Search, Modals).
- Renders entity-related modals (Edit, Delete, Add Employee, Add Workstation).
- Displays alerts through `InlineAlert`.
- Wires up callback handlers (`onSuccess`, `onError`, `onDelete`) passed into modals and forms.
- Keeps business logic out of JSX by relying on orchestration + hooks.

---

## 🔗 Key Imports
- `useEntityOrchestration` — single hook providing `uiState`, `alerts`, `search`, `actions`, and `editHandlers`.
- BCGov Design System components: `Header`, `Footer`, `InlineAlert`.
- Custom components: `Search`, `EditModal`, `DeleteAlertDialog`, `ModalDialog`, `EmployeeForm`, `WorkstationForm`.

---

## 📋 Render Flow
1. **Header** — Title bar.
2. **Search** — Connected to `search` state and `actions.openSearchResultEditModal`.
3. **EditModal** — Shown if an entity is selected, wired to `editHandlers.onEditSuccess/onEditError`.
4. **DeleteAlertDialog** — Shown if an employee is selected + delete dialog is open.
5. **ModalDialog (Add Employee)** — Includes `EmployeeForm` wired with add callbacks.
6. **ModalDialog (Add Workstation)** — Includes `WorkstationForm` wired with add callbacks.
7. **InlineAlert** — Displays success/error messages from `alerts`.
8. **Footer** — Static footer.  