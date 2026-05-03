import {WorkstationFormValues} from "@/types";
import {validateAssetTagField, validateNotesField, validateOfficeNumberField} from "@/validators";
import {getWorkstationModelById} from "@/db/data-access/lookups";
import {officeExistsByOfficeNumber} from "@/db/data-access/offices";


export async function validateWorkstationData(workstation: WorkstationFormValues) {
    const fieldValidationError =
        validateAssetTagField(workstation.asset_tag) ??
        validateOfficeNumberField(workstation.office_number) ??
        (workstation.notes ? validateNotesField(workstation.notes) : undefined)

    if (fieldValidationError) {
        return fieldValidationError
    }

    const workstationModel = await getWorkstationModelById(workstation.model_id)
    if (!workstationModel) {
        return `The selected workstation model is invalid. Please reselect a model and try again.`
    }

    const assetTagValidationError = validateAssetTagForWorkstationModel(
        workstation.asset_tag,
        workstationModel.name
    )
    if (assetTagValidationError) {
        return assetTagValidationError
    }

    const officeExists = await officeExistsByOfficeNumber(workstation.office_number)
    if (!officeExists) {
        return `Office number "${workstation.office_number}" does not exist. Please enter a valid office number.`
    }
}

function validateAssetTagForWorkstationModel(assetTag: string, modelName: string) {
    const expectedLength = getExpectedAssetTagLength(modelName)

    if (assetTag.length !== expectedLength) {
        return `Asset Tag "${assetTag}" must be exactly ${expectedLength} characters long for ${modelName}`
    }

    const prefixValidationError = validateAssetTagPrefix(
        assetTag,
        modelName
    )
    if (prefixValidationError) {
        return prefixValidationError
    }
}

function getExpectedAssetTagLength(modelName: string) {
    switch (modelName) {
        case "Microsoft Surface Pro 11":
            return 14

        case "Apple MacBook Pro":
            return 10

        default:
            return 8
    }
}

function validateAssetTagPrefix(assetTag: string, modelName: string) {
    switch (modelName) {
        case "Microsoft Surface Pro 11":
            if (!assetTag.startsWith("B")) {
                return `Asset Tag "${assetTag}" must start with "B" for ${modelName}`
            }
    }
}
