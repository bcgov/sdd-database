export async function createXlsxResponse(rows: Array<Array<string | number | boolean | null>>, filename: string, sheetName = "Report") {
    const ExcelJS = (await import("exceljs")).default;
    const workbook = new ExcelJS.Workbook();
    workbook.creator = "sdd-database";
    workbook.lastModifiedBy = "sdd-database";

    const worksheet = workbook.addWorksheet(sheetName);
    worksheet.addRows(rows.map((row) => row.map((value) => (value === null || value === undefined ? "" : value))));

    const buffer = await workbook.xlsx.writeBuffer();
    const bytes = new Uint8Array(buffer);

    return new Response(bytes, {
        status: 200,
        headers: {
            "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "Content-Disposition": `attachment; filename="${filename}"`,
        },
    });
}
