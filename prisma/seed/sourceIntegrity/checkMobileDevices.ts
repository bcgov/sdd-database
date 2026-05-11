import path from "path";
import {getCellString, getRequiredHeaderToCol, loadWorksheetFromFile} from "../shared/excel";
import ExcelJS from "exceljs";
import {assertOfficeNumber} from "../validators/offices.validators";
import {assertOfficeNumberExistsInOfficeInformation, buildValidOfficeNumbersFromOfficeInformation} from "./shared";
import {assertImei} from "../validators/mobileDevices.validators";
import {isNotAnEmployeeRow} from "../shared/employees";
import {
    isNotAMobileDeviceRow,
    isNotAnEmployeeMobileDeviceAssignment,
    NON_EMPLOYEE_MOBILE_DEVICE_ASSIGNED_TO,
    NON_EMPLOYEE_MOBILE_DEVICE_IDIR
} from "../shared/mobileDevices";
import {assertNoDuplicates} from "../shared/assertions";


const MOBILE_DEVICES_FILE_PATH = path.join(
    process.cwd(),
    "prisma",
    "data",
    "Mobile Devices.xlsx"
)

const COMPUTERS_AND_LAPTOPS_FILE_PATH = path.join(
    process.cwd(),
    "prisma",
    "data",
    "Computers and Laptops.xlsx"
)

const MOBILE_DEVICE_SOURCE_EDGE_CASES_OUTPUT_FILE_PATH = path.join(
    process.cwd(),
    "prisma",
    "data",
    "Mobile Device Source Edge Cases.xlsx"
)

const MOBILE_DEVICES_SOURCE_INTEGRITY_HEADERS = [
    "OfficeNum",
    "IMEI",
    "IDIR",
    "Assigned To",
    "Notes",
    "Hardware"
] as const

const COMPUTERS_AND_LAPTOPS_EMPLOYEE_LOOKUP_HEADERS = [
    "OfficeNum",
    "IDIR",
    "Assigned To"
] as const

const HARDWARE_WITHOUT_IMEI = new Set<string>([
    "OiaB",
    "Qualcomm GSP-1700"
])

type MobileDeviceImeiRecord = {
    rowNumber: number
    imei: string
}

type ComputersAndLaptopsEmployeeRecord = {
    rowNumber: number
    officeNumber: string
    idir: string | null
    assignedTo: string
}

type ComputersAndLaptopsEmployeeLookup = {
    byIdir: Map<string, ComputersAndLaptopsEmployeeRecord>,
    byOfficeAndAssignedTo: Map<string, ComputersAndLaptopsEmployeeRecord>
}

export async function checkMobileDevices() {
    const mobileDevicesWorksheet = await loadWorksheetFromFile(MOBILE_DEVICES_FILE_PATH)

    const headerToCol = getRequiredHeaderToCol(
        mobileDevicesWorksheet,
        MOBILE_DEVICES_SOURCE_INTEGRITY_HEADERS
    )

    assertNoDuplicateMobileDeviceImeis(mobileDevicesWorksheet, headerToCol)

    const validOfficeNumbers = await buildValidOfficeNumbersFromOfficeInformation()
    const computersAndLaptopsEmployeeLookup = await buildComputersAndLaptopsEmployeeLookup()

    const mobileDeviceSourceEdgeCasesWorkbook = new ExcelJS.Workbook()
    const assignedToMismatchRows = mobileDeviceSourceEdgeCasesWorkbook.addWorksheet("Assigned To Mismatch")
    assignedToMismatchRows.addRow([
        "Common IDIR",
        "Mobile Assigned To",
        "Computers and Laptops Assigned To"
    ])
    const officeNumberMismatchRows = mobileDeviceSourceEdgeCasesWorkbook.addWorksheet("Office Number Mismatch")
    officeNumberMismatchRows.addRow([
        "Common IDIR",
        "Mobile OfficeNum",
        "Computers and Laptops OfficeNum"
    ])

    const sourceRowsToDelete = new Set<number>()

    for (let r = 2; r <= mobileDevicesWorksheet.rowCount; r++) {
        const row = mobileDevicesWorksheet.getRow(r)

        assertPopulatedOfficeNumberExistsInOfficeInformation(row, r, headerToCol, validOfficeNumbers)
        assertHardwareImeiRules(row, r, headerToCol)
        assertBlankImeiHasNotes(row, r, headerToCol)
        assertImeiRowsHaveOfficeNumber(row, r, headerToCol)
        assertMobileNonEmployeeAssignmentFieldsAreConsistent(row, r, headerToCol)
        assertMobileEmployeeExistsInComputersAndLaptops(row, r, headerToCol, computersAndLaptopsEmployeeLookup)

        recordMobileAssignedToMismatchIfNeeded(
            row,
            r,
            headerToCol,
            computersAndLaptopsEmployeeLookup,
            assignedToMismatchRows,
            sourceRowsToDelete
        )
        recordMobileOfficeNumberMismatchIfNeeded(
            row,
            r,
            headerToCol,
            computersAndLaptopsEmployeeLookup,
            officeNumberMismatchRows,
            sourceRowsToDelete
        )
    }

    const hasSourceEdgeCaseRows =
        assignedToMismatchRows.rowCount > 1 ||
        officeNumberMismatchRows.rowCount > 1

    if (hasSourceEdgeCaseRows) {
        await mobileDeviceSourceEdgeCasesWorkbook.xlsx.writeFile(
            MOBILE_DEVICE_SOURCE_EDGE_CASES_OUTPUT_FILE_PATH
        )

        console.log(
            `Wrote mobile device source edge cases to ${MOBILE_DEVICE_SOURCE_EDGE_CASES_OUTPUT_FILE_PATH}`
        )

        await deleteRowsFromMobileDevicesSourceFile(sourceRowsToDelete)
    }
}

function assertNoDuplicateMobileDeviceImeis(
    worksheet: ExcelJS.Worksheet,
    headerToCol: Record<(typeof MOBILE_DEVICES_SOURCE_INTEGRITY_HEADERS)[number], number>
) {
    const imeiRows: MobileDeviceImeiRecord[] = []

    for (let r = 2; r <= worksheet.rowCount; r++) {
        const row = worksheet.getRow(r)

        const imei = getCellString(row, headerToCol, "IMEI")

        if (!imei) continue

        imeiRows.push({
            rowNumber: r,
            imei
        })
    }

    assertNoDuplicates(
        imeiRows,
        {
            getKey: row => row.imei,
            label: "mobile device IMEI"
        }
    )
}

/**
 * Any non-empty OfficeNum must exist in Office Information.xlsx
 *
 * @param row
 * @param rowNumber
 * @param headerToCol
 * @param validOfficeNumbers
 */
function assertPopulatedOfficeNumberExistsInOfficeInformation(
    row: ExcelJS.Row,
    rowNumber: number,
    headerToCol: Record<(typeof MOBILE_DEVICES_SOURCE_INTEGRITY_HEADERS)[number], number>,
    validOfficeNumbers: Set<string>
) {
    const officeNumber = getCellString(row, headerToCol, "OfficeNum")

    if (officeNumber) {
        assertOfficeNumberExistsInOfficeInformation(
            officeNumber,
            rowNumber,
            "Mobile Devices.xlsx",
            validOfficeNumbers
        )
    }
}

/**
 * If IMEI is blank, Notes must not be blank.
 *
 * @param row
 * @param rowNumber
 * @param headerToCol
 */
function assertBlankImeiHasNotes(
    row: ExcelJS.Row,
    rowNumber: number,
    headerToCol: Record<(typeof MOBILE_DEVICES_SOURCE_INTEGRITY_HEADERS)[number], number>
) {
    const imei = getCellString(row, headerToCol, "IMEI")
    const notes = getCellString(row, headerToCol, "Notes")

    if (imei) return
    if (notes) return

    throw new Error(
        `Mobile Devices.xlsx row ${rowNumber} has blank IMEI and blank Notes. If IMEI is blank, Notes should explain why.`
    )
}

/**
 * If IMEI is present, OfficeNum must not be blank and must be valid
 *
 * @param row
 * @param rowNumber
 * @param headerToCol
 */
function assertImeiRowsHaveOfficeNumber(
    row: ExcelJS.Row,
    rowNumber: number,
    headerToCol: Record<(typeof MOBILE_DEVICES_SOURCE_INTEGRITY_HEADERS)[number], number>
) {
    const imei = getCellString(row, headerToCol, "IMEI")
    const officeNumber = getCellString(row, headerToCol, "OfficeNum")

    if (!imei) return

    assertOfficeNumber(officeNumber, rowNumber)
}

/**
 * Cellular phone hardware must have a valid IMEI
 * Non-cellular hardware must have blank IMEI
 *
 * @param row
 * @param rowNumber
 * @param headerToCol
 */
function assertHardwareImeiRules(
    row: ExcelJS.Row,
    rowNumber: number,
    headerToCol: Record<(typeof MOBILE_DEVICES_SOURCE_INTEGRITY_HEADERS)[number], number>
) {
    const hardware = getCellString(row, headerToCol, "Hardware")
    const imei = getCellString(row, headerToCol, "IMEI")

    if (!hardware) {
        if (!imei) return
        throw new Error(
            `Mobile Devices.xlsx row ${rowNumber} has IMEI "${imei}" but Hardware is blank. Rows with IMEI should have Hardware populated.`
        )
    }

    if (HARDWARE_WITHOUT_IMEI.has(hardware)) {
        if (!imei) return

        throw new Error(
            `Mobile Devices.xlsx row ${rowNumber} has Hardware "${hardware}" but IMEI is populated. ${hardware} records should not have an IMEI.`
        )
    }

    assertImei(imei, rowNumber)
}

function assertMobileNonEmployeeAssignmentFieldsAreConsistent(
    row: ExcelJS.Row,
    rowNumber: number,
    headerToCol: Record<(typeof MOBILE_DEVICES_SOURCE_INTEGRITY_HEADERS)[number], number>
) {
    if (isNotAMobileDeviceRow(row, headerToCol)) return

    const assignedTo = getCellString(row, headerToCol, "Assigned To")
    const idir = getCellString(row, headerToCol, "IDIR")

    const hasNonEmployeeAssignedTo =
        assignedTo === NON_EMPLOYEE_MOBILE_DEVICE_ASSIGNED_TO

    const hasNonEmployeeIdir =
        idir === NON_EMPLOYEE_MOBILE_DEVICE_IDIR

    if (hasNonEmployeeAssignedTo === hasNonEmployeeIdir) return

    throw new Error(
        `Mobile Devices.xlsx row ${rowNumber} has inconsistent non-employee assignment fields. Assigned To="${assignedTo}", IDIR="${idir}". Expected Assigned To="${NON_EMPLOYEE_MOBILE_DEVICE_ASSIGNED_TO}" and IDIR="${NON_EMPLOYEE_MOBILE_DEVICE_IDIR}", or neither`
    )
}

async function buildComputersAndLaptopsEmployeeLookup(): Promise<ComputersAndLaptopsEmployeeLookup> {
    const computersAndLaptopsWorksheet = await loadWorksheetFromFile(COMPUTERS_AND_LAPTOPS_FILE_PATH)

    const headerToCol = getRequiredHeaderToCol(
        computersAndLaptopsWorksheet,
        COMPUTERS_AND_LAPTOPS_EMPLOYEE_LOOKUP_HEADERS
    )

    const byIdir = new Map<string, ComputersAndLaptopsEmployeeRecord>()
    const byOfficeAndAssignedTo = new Map<string, ComputersAndLaptopsEmployeeRecord>()

    const assignedToHeader = "Assigned To"

    for (let r = 2; r <= computersAndLaptopsWorksheet.rowCount; r++) {
        const row = computersAndLaptopsWorksheet.getRow(r)

        if (isNotAnEmployeeRow(row, headerToCol, assignedToHeader)) continue

        const officeNumber = getCellString(row, headerToCol, "OfficeNum")
        const rawIdir = getCellString(row, headerToCol, "IDIR")
        const assignedTo = getCellString(row, headerToCol, assignedToHeader)

        const idir = rawIdir && rawIdir !== "IDIR"
            ? rawIdir
            : null

        const employeeRecord: ComputersAndLaptopsEmployeeRecord = {
            rowNumber: r,
            officeNumber,
            idir,
            assignedTo
        }

        if (idir) {
            byIdir.set(idir, employeeRecord)
        }

        byOfficeAndAssignedTo.set(
            buildOfficeAndAssignedToKey(officeNumber, assignedTo),
            employeeRecord
        )
    }

    return {
        byIdir,
        byOfficeAndAssignedTo
    }
}

function buildOfficeAndAssignedToKey(
    officeNumber: string,
    assignedTo: string
) {
    return `${officeNumber}::${assignedTo}`
}

function assertMobileEmployeeExistsInComputersAndLaptops(
    row: ExcelJS.Row,
    rowNumber: number,
    headerToCol: Record<(typeof MOBILE_DEVICES_SOURCE_INTEGRITY_HEADERS)[number], number>,
    computersAndLaptopsEmployeeLookup: ComputersAndLaptopsEmployeeLookup
) {
    if (isNotAMobileDeviceRow(row, headerToCol)) return
    if (isNotAnEmployeeMobileDeviceAssignment(row, headerToCol)) return

    const officeNumber = getCellString(row, headerToCol, "OfficeNum")
    const assignedTo = getCellString(row, headerToCol, "Assigned To")
    const idir = getCellString(row, headerToCol, "IDIR")

    if (!idir) {
        throw new Error(
            `Mobile Devices.xlsx row ${rowNumber} has Hardware populated but IDIR is blank. Physical mobile device rows should identify the assigned employee.`
        )
    }

    if (!assignedTo) {
        throw new Error(
            `Mobile Devices.xlsx row ${rowNumber} has Hardware populated but Assigned To is blank. Physical mobile device rows should identify the assigned employee.`
        )
    }

    const computersAndLaptopsEmployee = findMobileEmployeeInComputersAndLaptops(
        row,
        headerToCol,
        computersAndLaptopsEmployeeLookup
    )

    if (computersAndLaptopsEmployee) return

    throw new Error(
        `Mobile Devices.xlsx row ${rowNumber} has employee Assigned To="${assignedTo}", IDIR="${idir}", OfficeNum="${officeNumber}" but this employee was not found in Computers and Laptops.xlsx. Mobile device employees should exist in Computers and Laptops.xlsx`
    )
}

function findMobileEmployeeInComputersAndLaptops(
    row: ExcelJS.Row,
    headerToCol: Record<(typeof MOBILE_DEVICES_SOURCE_INTEGRITY_HEADERS)[number], number>,
    computersAndLaptopsEmployeeLookup: ComputersAndLaptopsEmployeeLookup
) {
    const rawIdir = getCellString(row, headerToCol, "IDIR")
    const idir = rawIdir && rawIdir !== "IDIR"
        ? rawIdir
        : null

    if (idir) {
        return computersAndLaptopsEmployeeLookup.byIdir.get(idir) ?? null
    }

    const officeNumber = getCellString(row, headerToCol, "OfficeNum")
    const assignedTo = getCellString(row, headerToCol, "Assigned To")

    return computersAndLaptopsEmployeeLookup.byOfficeAndAssignedTo.get(
        buildOfficeAndAssignedToKey(officeNumber, assignedTo)
    ) ?? null
}

/**

 * If Mobile Devices.xlsx has an IDIR, and that IDIR exists in Computers and Laptops.xlsx, record cases where the
 * Assigned To value does not match across both files.
 *
 * @param row
 * @param rowNumber
 * @param headerToCol
 * @param computersAndLaptopsEmployeeLookup
 * @param outputWorksheet
 * @param sourceRowsToDelete
 */
function recordMobileAssignedToMismatchIfNeeded(
    row: ExcelJS.Row,
    rowNumber: number,
    headerToCol: Record<(typeof MOBILE_DEVICES_SOURCE_INTEGRITY_HEADERS)[number], number>,
    computersAndLaptopsEmployeeLookup: ComputersAndLaptopsEmployeeLookup,
    outputWorksheet: ExcelJS.Worksheet,
    sourceRowsToDelete: Set<number>
) {
    if (isNotAMobileDeviceRow(row, headerToCol)) return
    if (isNotAnEmployeeMobileDeviceAssignment(row, headerToCol)) return

    const rawIdir = getCellString(row, headerToCol, "IDIR")
    const idir = rawIdir && rawIdir !== "IDIR"
        ? rawIdir
        : null

    // Let assertMobileEmployeeExistsInComputersAndLaptops handle blank IDIR.
    if (!idir) return

    const computersAndLaptopsEmployee = computersAndLaptopsEmployeeLookup.byIdir.get(idir)

    // Let assertMobileEmployeeExistsInComputersAndLaptops handle missing employee.
    if (!computersAndLaptopsEmployee) return

    const mobileAssignedTo = getCellString(row, headerToCol, "Assigned To")

    if (mobileAssignedTo === computersAndLaptopsEmployee.assignedTo) return;

    outputWorksheet.addRow([
            idir,
            mobileAssignedTo,
            computersAndLaptopsEmployee.assignedTo
        ])

    sourceRowsToDelete.add(rowNumber)
}

/**
 * For employee-assigned mobile devices, OfficeNum should match the employee's OfficeNum
 * in Computers and Laptops.xlsx. Record cases where it doesn't
 *
 * REDEPLOY / REASSIGN rows are skipped because they are not assigned to an employee.
 */
function recordMobileOfficeNumberMismatchIfNeeded(
    row: ExcelJS.Row,
    rowNumber: number,
    headerToCol: Record<(typeof MOBILE_DEVICES_SOURCE_INTEGRITY_HEADERS)[number], number>,
    computersAndLaptopsEmployeeLookup: ComputersAndLaptopsEmployeeLookup,
    outputWorksheet: ExcelJS.Worksheet,
    sourceRowsToDelete: Set<number>
) {
    if (isNotAMobileDeviceRow(row, headerToCol)) return
    if (isNotAnEmployeeMobileDeviceAssignment(row, headerToCol)) return

    const rawIdir = getCellString(row, headerToCol, "IDIR")
    const idir = rawIdir && rawIdir !== "IDIR"
        ? rawIdir
        : null

    // Let assertMobileEmployeeExistsInComputersAndLaptops handle blank IDIR.
    if (!idir) return

    const computersAndLaptopsEmployee = computersAndLaptopsEmployeeLookup.byIdir.get(idir)

    // Let assertMobileEmployeeExistsInComputersAndLaptops handle missing employee.
    if (!computersAndLaptopsEmployee) return

    const mobileOfficeNumber = getCellString(row, headerToCol, "OfficeNum")

    if (mobileOfficeNumber === computersAndLaptopsEmployee.officeNumber) return

    outputWorksheet.addRow([
        idir,
        mobileOfficeNumber,
        computersAndLaptopsEmployee.officeNumber
    ])

    sourceRowsToDelete.add(rowNumber)
}

async function deleteRowsFromMobileDevicesSourceFile(rowNumbersToDelete: Set<number>) {
    if (rowNumbersToDelete.size === 0) return

    const workbook = new ExcelJS.Workbook()
    await workbook.xlsx.readFile(MOBILE_DEVICES_FILE_PATH)

    const worksheet = workbook.worksheets[0]

    // convert set to array and then sort in descending order in order to delete rows in descending order
    const sortedRowNumbersToDelete = Array.from(rowNumbersToDelete).sort(
        (a, b) => b - a
    )

    for (const rowNumber of sortedRowNumbersToDelete) {
        worksheet.spliceRows(rowNumber, 1)
    }

    await workbook.xlsx.writeFile(MOBILE_DEVICES_FILE_PATH)

    console.log(
        `Deleted ${rowNumbersToDelete.size} edge-case rows from ${MOBILE_DEVICES_FILE_PATH}`
    )
}
