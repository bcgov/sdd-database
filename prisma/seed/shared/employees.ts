import ExcelJS from "exceljs";
import {getCellString} from "./excel";
import {assertIdir} from "../validators/employees.validators";
import {parseAndAssertAssignedTo} from "./parsers";
import {assertOfficeNumber} from "../validators/offices.validators";


const NON_EMPLOYEE_ASSIGNED_TO_VALUES = new Set<string>([
    "Free Address",
    "HOLD",
    "PUBLIC JobBank Kiosk",
    "REDEPLOY",
    "Vacant",
] as const)

export function isNotAnEmployeeRow<THeader extends string>(
    row: ExcelJS.Row,
    headerToCol: Record<THeader, number>,
    assignedToHeader: THeader) {

    const assignedTo = getCellString(row, headerToCol, assignedToHeader)

    return NON_EMPLOYEE_ASSIGNED_TO_VALUES.has(assignedTo)
}

/**
 * Here by Employee Id we mean the internal primary key
 * Map <idir, id>
 * @param rows
 */
export function buildEmployeeIdByIdirLookup(
    rows: Array<{
        id: number
        idir: string | null
    }>
) {
    const lookup = new Map<string, number>()

    for (const row of rows) {
        if (!row.idir || row.idir === "IDIR") continue
        lookup.set(row.idir, row.id)
    }

    return lookup
}

/**
 * Here by Employee Id we mean the internal primary key
 * Map <officeNumber::last_name::first_name::alternate_name, id>
 * @param rows
 */
export function buildEmployeeIdByOfficeAndNameLookup(
    rows: Array<{
        id: number
        office_number: string
        first_name: string
        alternate_name: string | null
        last_name: string
    }>
) {
    const lookup = new Map<string, number>()

    for (const row of rows) {
        const key = `${row.office_number}::${row.last_name}::${row.first_name}${row.alternate_name ? `::${row.alternate_name}` : ""}`
        lookup.set(key, row.id)
    }

    return lookup
}

export function resolveEmployeeId<THeader extends string>(
    row: ExcelJS.Row,
    rowNumber: number,
    headerToCol: Record<THeader, number>,
    options: {
        assignedToHeader: THeader,
        idirHeader: THeader,
        officeNumberHeader: THeader,
        employeeIdByIdirLookup: Map<string, number>,
        employeeIdByOfficeAndNameLookup: Map<string, number>,
    }
) {

    const {
        assignedToHeader,
        idirHeader,
        officeNumberHeader,
        employeeIdByIdirLookup,
        employeeIdByOfficeAndNameLookup,
    } = options

    if (isNotAnEmployeeRow(row, headerToCol, assignedToHeader)) {
        return null
    }

    const rawIdir = getCellString(row, headerToCol, idirHeader)
    const idir = rawIdir && rawIdir !== "IDIR" ? rawIdir : null
    if (idir) {
        assertIdir(idir, rowNumber)
    }

    // internal employee id i.e. primary key
    let employeeId = idir ? (employeeIdByIdirLookup.get(idir) ?? null) : null

    // if idir is not available to fetch employee internal id then we rely on Assigned To and Office Number field
    if (!employeeId) {
        const assignedTo = getCellString(row, headerToCol, assignedToHeader)
        const fullName = parseAndAssertAssignedTo(assignedTo, rowNumber)

        const rawOfficeNumber = getCellString(row, headerToCol, officeNumberHeader)
        assertOfficeNumber(rawOfficeNumber, rowNumber)

        const key = `${rawOfficeNumber}::${fullName.lastName}::${fullName.firstName}${fullName.alternateName ? `::${fullName.alternateName}` : ""}`

        employeeId = employeeIdByOfficeAndNameLookup.get(key) ?? null

        // if even office number and Assigned To field is not enough, then we throw an error
        if (!employeeId) {
            throw new Error(
                `Could not resolve employee id at row ${rowNumber}. ` +
                `OfficeNum="${rawOfficeNumber}", Assigned To="${assignedTo}", IDIR="${idir ?? ""}".`
            )
        }
    }
    return employeeId
}
