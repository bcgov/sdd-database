# Types

This doc describes the core domain types used across the UI + server actions, and how we model “hydrated” entities coming from Prisma.

---

## Source of truth

Most domain types come directly from Prisma models (generated types), not handwritten interfaces.

- Model types: `Employee`, `Office`, `Workstation`, `ProgramArea`, etc.
- Prisma helper types: `Prisma.EmployeeGetPayload<...>` (for “hydrated” includes/selects)

> **Note:** Import types from the same Prisma client entrypoint your app uses (e.g. `@/generated/prisma/client`).  
> If you import from `@prisma/client` while your runtime client comes from generated output, you can get runtime/module issues in some setups.

---

## BranchOption + ProgramAreaOption (UI dropdown types)

Used for Select components and similar UI controls.

```ts
export type BranchOption = {
  id: number;
  name: string;
};

export type ProgramAreaOption = {
  id: number;
  name: string;
};
```

---

## EmployeeFormState

Form state extends the base Employee model and adds UI-only fields.

```ts
export type EmployeeFormState = Employee & {
    // present for hydrated employees (selectedSearchResult), absent for drafts (draftEmployee)
    program_area?: ProgramArea;

    // UI-only branch cache (so branch prefill survives modal close/open)
    ui_branch_id?: number;
};
```
---

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
   