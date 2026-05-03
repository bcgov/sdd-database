import {Accordion, Select, TextArea, TextField} from "@bcgov/design-system-react-components";
import {LookupOption, WorkstationSearchResult} from "@/types";
import {validateAssetTagField, validateNotesField, validateOfficeNumberField} from "@/validators";


interface WorkstationDetailsProps {
    workstation?: WorkstationSearchResult
    workstationModels: LookupOption[]

    isAssetTagReadOnly: boolean
    isModelReadOnly: boolean
    isOfficeNumberReadOnly: boolean
    isNotesReadOnly: boolean
}

export function WorkstationDetails({
                                       workstation,
                                       workstationModels,

                                       isAssetTagReadOnly,
                                       isModelReadOnly,
                                       isOfficeNumberReadOnly,
                                       isNotesReadOnly
                                   }: WorkstationDetailsProps) {

    return (
        <Accordion label="Workstation Details" id="workstationDetails">
            <div>
                <TextField label="Asset Tag"
                           name="assetTag"
                           isRequired
                           isReadOnly={isAssetTagReadOnly}
                           validate={validateAssetTagField}
                           defaultValue={workstation?.asset_tag}>
                </TextField>

                <Select label="Model"
                        name="model"
                        isRequired
                        items={workstationModels.map(model => (
                            {
                                id: model.id,
                                label: model.name
                            }
                        ))}
                        isDisabled={isModelReadOnly}
                        selectedKey={workstation?.model_id}>
                </Select>

                {/* Passing model id through a hidden field since disabled fields won't be included in form data */}
                {isModelReadOnly && workstation && (
                    <input type="hidden"
                           name="model"
                           value={workstation.model_id}
                           >
                    </input>
                )}

                <TextField label="Currently at Office Number"
                           name="officeNumber"
                           isRequired
                           isReadOnly={isOfficeNumberReadOnly}
                           validate={validateOfficeNumberField}
                           defaultValue={workstation?.office_number}>
                </TextField>

                <TextArea label="Notes"
                          name="notes"
                          maxLength={2000}
                          isReadOnly={isNotesReadOnly}
                          validate={validateNotesField}
                          defaultValue={workstation?.notes ?? undefined}>
                </TextArea>
            </div>
        </Accordion>
    )
}
