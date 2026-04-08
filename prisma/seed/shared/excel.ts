import ExcelJS from "exceljs";


export async function loadWorksheetFromFile(filePath: string, excelSheetIndex = 0): Promise<ExcelJS.Worksheet> {
    const workbook = new ExcelJS.Workbook()
    await workbook.xlsx.readFile(filePath)

    const worksheet = workbook.worksheets[excelSheetIndex]

    if (!worksheet) {
        throw new Error(`No worksheet at index ${excelSheetIndex} found in ${filePath}`)
    }

    return worksheet
}

export function logSheetInfo(worksheet: ExcelJS.Worksheet) {
    console.log("Excel loaded.")
    console.log("Sheet name: ", worksheet.name)
    console.log("Row count: ", worksheet.rowCount)
    console.log("Column count: ", worksheet.columnCount)
}

export function getRequiredHeaderToCol<const Headers extends readonly string[]>(worksheet: ExcelJS.Worksheet, requiredHeaders: Headers): Record<Headers[number], number> {
    const headerToColAll = getHeaderToCol(worksheet)
    return assertRequiredHeaders(headerToColAll, requiredHeaders);    // returns Record<RequiredHeader, number>
}

/**
 * Parses and maps all headers in the Excel file to the column number
 *
 * Returns an object like
 * {
 *   "OfficeNum": 1,
 *   "Office Name": 2,
 *   "Postal Code": 5,
 *   ...
 * }
 */
function getHeaderToCol(worksheet: ExcelJS.Worksheet): Record<string, number> {

    // Build a lookup: headerName -> ColumnIndex (1-based)
    const headerToCol: Record<string, number> = {}

    const headerRow = worksheet.getRow(1)

    headerRow.eachCell({includeEmpty: true}, (cell, colNumber) => {

        const header = cellToString(cell.value)

        if (!header) return

        headerToCol[header] = colNumber
    })

    return headerToCol
}

/**
 * Makes sure that the headerToCol object does include all the required headers
 *
 * Function says give me a requiredHeaders array (the exact list of header strings).
 * I will return an object whose keys are exactly those strings and whose values are numbers.
 *
 * H[number]: If Headers is an array type, Headers[number] means "any element of that array"
 * @return Record<Headers[number], number>: If Headers is readonly ["OfficeNum", "Office Name"], then Headers[number] becomes
 * "OfficeNum" | "Office Name" and hence Record <Headers[number], number> becomes Record<"OfficeNum"| "Office Name", number>
 */
function assertRequiredHeaders<const Headers extends readonly string[]>(headerToCol: Record<string, number>, requiredHeaders: Headers): Record<Headers[number], number> {

    const requiredHeaderToCol: Partial<Record<Headers[number], number>> = {}

    for (const requiredHeader of requiredHeaders as ReadonlyArray<Headers[number]>) {

        const col = headerToCol[requiredHeader]

        if (col === undefined) {
            throw new Error(`Missing required column header: "${requiredHeader}"`)
        } else {
            requiredHeaderToCol[requiredHeader] = col
        }
    }

    return requiredHeaderToCol as Record<Headers[number], number>
}

export function getCellString<const Headers extends readonly string[]>(row: ExcelJS.Row, headerToCol: Record<Headers[number], number>, header: Headers[number]) {
    const headerColumnNumber = headerToCol[header]

    return cellToString(row.getCell(headerColumnNumber).value)
}

function cellToString(value: ExcelJS.CellValue) {
    // we use == for null check instead of === so that we can match both null and undefined in one go
    // So, if (value == null) is the same as if (value === null) | (value === undefined)
    if (value == null) return "";
    if (typeof value === "string") return value.trim();
    if (typeof value === "number") return String(value).trim();
    if (typeof value === "boolean") return String(value);
    if (value instanceof Date) return value.toISOString();

    if (typeof value === "object") {

        /**
         * In Excel, a cell can contain text with mixed formatting (bold for part, etc.).
         * ExcelJS represents that like:
         * { richText: [{ text: "Hello" }, { text: " World" }] }
         */
        if ("richText" in value && Array.isArray(value.richText)) {
            return value.richText.map((rt) => rt.text).join("").trim();
        }

        // Formula cells look like { formula: "A1&B1", result: "Vancouver" }
        if ("formula" in value) {
            if (value.formula != null) {
                return cellToString(value.result);
            }
        }
    }

    // Fallback: If it’s some other object type you didn’t explicitly handle (hyperlink, error, etc.), it converts it to string anyway instead of crashing.
    return String(value).trim();
}

export function getRowValues(row: ExcelJS.Row, columnCount: number) {
    const values: ExcelJS.CellValue[] = []

    for (let col = 1; col <= columnCount; col++) {
        values.push(row.getCell(col).value)
    }

    return values
}
