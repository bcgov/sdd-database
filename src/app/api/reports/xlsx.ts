import ExcelJS from "exceljs";

type SheetRow = Array<string | number | boolean | null>;
type SheetDefinition = {
    name: string;
    rows: Array<SheetRow>;
};

async function buildWorkbookBuffer(sheets: Array<SheetDefinition>) {
    const workbook = new ExcelJS.Workbook();

    sheets.forEach(({name, rows}) => {
        const worksheet = workbook.addWorksheet(name);
        worksheet.addRows(
            rows.map((row) =>
                row.map((value) => (value === null || value === undefined ? "" : value))
            )
        );
    });

    return workbook.xlsx.writeBuffer();
}

export async function createXlsxResponse(rows: Array<SheetRow>, filename: string, sheetName = "Report") {
    const buffer = await buildWorkbookBuffer([{name: sheetName, rows}]);
    const bytes = new Uint8Array(buffer);

    return new Response(bytes, {
        status: 200,
        headers: {
            "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "Content-Disposition": `attachment; filename="${filename}"`,
        },
    });
}

export async function createMultiSheetXlsxResponse(sheets: Array<SheetDefinition>, filename: string) {
    const buffer = await buildWorkbookBuffer(sheets);
    const bytes = new Uint8Array(buffer);

    return new Response(bytes, {
        status: 200,
        headers: {
            "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "Content-Disposition": `attachment; filename="${filename}"`,
        },
    });
}
