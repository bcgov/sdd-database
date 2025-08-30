# Data Processing Steps

The following data transformations are applied to source data from the Access Database before migrating the data onto this new web application.

## 1. Connect to Oracle ODS.em_organization_employee Table
- Established a connection to the Oracle database to access the **`ODS.em_organization_employee`** table.

## 2. Import the Computers and Laptops Table from Access (Excel)
- Exported the combined **Computers/Laptops** table from Access to Excel.
- Result: **3663** total rows.

## 3. Filter “Assigned To” for Employee‐Specific Rows
- Focused on rows where **`Assigned To`** contains a comma (to isolate “Last, First” patterns).
- Reduced from **3663** down to **2057** rows.

## 4. Parse “Assigned To” for First, Last, Alternate Names
- Example transformations:
  - **`Cochrane, Christine`** → First: `Christine`, Last: `Cochrane`, Alternate: *None*
  - **`Ferris, Lee (Jeffrey)`** → First: `Lee`, Last: `Ferris`, Alternate: `Jeffrey`

## 5. Clean the IDIR Column
- Removed artifacts (e.g., `_x000d_`, carriage returns, newlines) from **`IDIR`**.
- Ensured consistent string formatting (trimmed spaces, etc.).

## 6. Merge with ODS.em_organization_employee
- Performed a **left join** on the cleaned **IDIR** to retrieve the **Employee ID** (`emplid`).
- Rows with matching **IDIR** in both tables were populated with an Employee ID.

## 7. Unmatched Rows
- Rows having no **IDIR** (or invalid ones) remain unmatched.
- After the merge, **1859** rows successfully matched with an Employee ID.

## 8. Create Office Table
- Imported the **Office Information** table from Access.
- Contains **112** rows.

## 9. Filter the Devices Table
- Kept rows where **`Computer Number`** is not `NaN` and **`Assigned To`** does not contain “Public”.
- Resulted in **1693** rows.

## 10. Filter the Workspace Table
- Kept rows where **`Workspace Number`** is not `NaN` and is numeric.
- Final count: **607** rows.