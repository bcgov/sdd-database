import {assertExactLength} from "./common.validators";


export function assertImei(imei: string, rowNumber: number) {
    const label = "IMEI"

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
