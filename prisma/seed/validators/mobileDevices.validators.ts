import {assertExactLength, assertNonEmpty} from "./common.validators";


export function assertIMEI(imei: string, rowNumber: number) {
    const label = "IMEI"

    assertNonEmpty(imei, label, rowNumber)

    assertExactLength(
        imei,
        label,
        rowNumber,
        15
    )

    if (/\D/.test(imei)) {
        throw new Error(`${label} can only contain digits (0-9) (got "${imei}" at row ${rowNumber})`)
    }
}
