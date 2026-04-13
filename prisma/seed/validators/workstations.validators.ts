import {assertNonEmpty} from "./common.validators";


export function assertAssetTag(assetTag: string, rowNumber: number) {
    const label = "Computer Number"

    assertNonEmpty(assetTag, label, rowNumber)

    const onlyLettersAndNumbers = /^[A-Za-z0-9]*$/

    if (!onlyLettersAndNumbers.test(assetTag)) {
        throw new Error(
            `${label} "${assetTag}" at row ${rowNumber} must contain only letters and numbers (no special characters)`
        )
    }

    const validLengths = [8, 10, 14]

    if ( !validLengths.includes(assetTag.length)) {
        throw new Error(
            `${label} "${assetTag}" at row ${rowNumber} must be exactly 8, 10 or 14 characters long`
        )
    }
}
