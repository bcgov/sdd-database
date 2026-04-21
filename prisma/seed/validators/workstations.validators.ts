import {assertNonEmpty} from "./common.validators";


export function assertAssetTag(
    assetTag: string,
    modelName: string,
    rowNumber: number
) {
    const label = "Computer Number"

    assertNonEmpty(assetTag, label, rowNumber)

    const onlyLettersAndNumbers = /^[A-Za-z0-9]*$/

    if (!onlyLettersAndNumbers.test(assetTag)) {
        throw new Error(
            `${label} "${assetTag}" at row ${rowNumber} must contain only letters and numbers (no special characters)`
        )
    }

    const expectedLength = getExpectedLength(modelName)

    if (assetTag.length !== expectedLength) {
        throw new Error(
            `${label} "${assetTag}" at row ${rowNumber} must be exactly ${expectedLength} characters long for ${modelName}`
        )
    }
}

function getExpectedLength(modelName: string) {
    switch (modelName) {
        case "Microsoft Surface Pro 11":
            return 14

        case "Apple MacBook Pro":
            return 10

        default:
            return 8
    }
}
