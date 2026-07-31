import {utils, write} from "xlsx";

type SheetRow = Array<string | number | boolean | null>;
type SheetDefinition = {
    name: string;
    rows: Array<SheetRow>;
};

function buildWorkbookBuffer(sheets: Array<SheetDefinition>) {
    const workbook = utils.book_new();

    sheets.forEach(({name, rows}) => {
        const worksheet = utils.aoa_to_sheet(rows.map((row) => row.map((value) => (value === null || value === undefined ? "" : value))));
        utils.book_append_sheet(workbook, worksheet, name);
    });

    return write(workbook, {bookType: "xlsx", type: "buffer"});
}

export async function createXlsxResponse(rows: Array<SheetRow>, filename: string, sheetName = "Report") {
    const buffer = buildWorkbookBuffer([{name: sheetName, rows}]);
    const bytes = new Uint8Array(buffer as ArrayBuffer);

    return new Response(bytes, {
        status: 200,
        headers: {
            "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "Content-Disposition": `attachment; filename="${filename}"`,
        },
    });
}

export async function createMultiSheetXlsxResponse(sheets: Array<SheetDefinition>, filename: string) {
    const buffer = buildWorkbookBuffer(sheets);
    const bytes = new Uint8Array(buffer as ArrayBuffer);

    return new Response(bytes, {
        status: 200,
        headers: {
            "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "Content-Disposition": `attachment; filename="${filename}"`,
        },
    });
}
