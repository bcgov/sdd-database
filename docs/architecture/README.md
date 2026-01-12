# 🧱 Code Architecture Overview

This section explains the core architectural decisions and how responsibilities are split across files.  
Each link provides a detailed breakdown.

---

## 📚 Architecture Docs

### [`Page.tsx`](./Page.md)
- Main application page and overall UI composition.
- Handles rendering of modals, alerts, and layout elements.
- Consumes a single orchestration hook (`useEntityOrchestration`) to stay lean and declarative.

---

### [`Hooks`](./Hooks.md)
- All custom React hooks that manage search, alerts, modal state, entity actions, and edit callbacks.
- The **orchestrator** (`useEntityOrchestration`) composes these hooks together and exposes a clean interface for the page.

---

### [`Search`](./Search.md)
- Documents **UI/UX rules** for the search flow.
- Covers when to display filters, what messages appear, and how optimistic results behave.
- Provides a single table summarizing edge cases for empty results and filter combinations.

---

### [`Database`](./Database.md)
- Prisma + PostgreSQL connection strategy.
- Explains the Prisma singleton + pool reuse and which Prisma entrypoint to use in app runtime vs seed scripts.
- Clarifies import rules (`@/db/client` vs `@/db/prisma`) and where Prisma types come from.

---

## 🧩 Roadmap (docs to add later)

- **Actions** (`src/actions/`) — server actions + business logic boundaries
- **Components** (`src/components/`) — component map + prop responsibilities
- **Types** (`src/types.ts`) — domain types + “hydrated” payload patterns