import {utils, write} from "xlsx";

export async function createXlsxResponse(rows: Array<Array<string | number | boolean | null>>, filename: string, sheetName = "Report") {
    const worksheet = utils.aoa_to_sheet(rows.map((row) => row.map((value) => (value === null || value === undefined ? "" : value))));
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, sheetName);

    const buffer = write(workbook, {bookType: "xlsx", type: "buffer"});
    const bytes = new Uint8Array(buffer as ArrayBuffer);

    return new Response(bytes, {
        status: 200,
        headers: {
            "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "Content-Disposition": `attachment; filename="${filename}"`,
        },
    });
}
