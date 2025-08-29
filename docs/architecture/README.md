# 🧱 Code Architecture Overview

This section explains the core architectural decisions and how responsibilities are split across files.  
Each link provides a detailed breakdown.

---

## 📁 Files and Responsibilities

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


3. **Actions Layer (`src/actions/`)**
   * Thin intermediary layer between UI (, business logic) and Database layer
   * Server Actions
      * `employees.ts`
      * `offices.ts`
   * Utility functions/files
      * `search.ts`

4. **Database Layer (`src/prisma-db.ts`)**
   * Directly interacts with the database using prisma

5. **Components (`src/components`)**
   * `/Search`
      * Search
      * FilterTags
      * SearchResultsList
      * SearchResultItem: _Represents each individual search result card_
   * `/Enitity_Forms`
      * EmployeeForm: _Used for both add new employee and edit employee_
      * OfficeForm
   * ModalDialog: _Used for both add and edit modals_
   * EditModal: _Used for both offices and employees_
   * DeleteAlertDialog

6. **Types**
   * `Entity.ts`
     
     ```
     (Employee & {
         type: "employee"
     }) | (Office & {
         type: "office"
     })
     ```

   * Employee

     Employee type isn't explicitly defined. We use the Model Employee available from `@prisma/client`

     ``` 
     {
         employee_id: string
         first_name: string
         middle_name: string | null
         last_name: string
         office_number: string
         notes: string | null
     } | undefined
     ```

   * Office

     Office type isn't explicitly defined. We use the Model Office available from `@prisma/client`

     ``` 
     {
         office_number: string
         notes: string | null
         office_name: string
         postal_code: string
     } | undefined
     ```

   * selectedSearchResult

     ```
     (
         {
             employee_id: string;
             first_name: string;
             middle_name: string | null;
             last_name: string;
             office_number: string;
             notes: string | null;
             type: "employee";
         }
         |
         {
             office_number: string;
             notes: string | null;
             office_name: string;
             postal_code: string;
             type: "office";
          }
      )
      | undefined
    ```