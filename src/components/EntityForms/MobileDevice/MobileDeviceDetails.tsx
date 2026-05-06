import {Accordion, Select, TextArea, TextField} from "@bcgov/design-system-react-components";
import {LookupOption, MobileDeviceFormValues} from "@/types";
import {validateImeiField, validateNotesField, validateOfficeNumberField} from "@/validators";
import {useState} from "react";
import {mobileDeviceModelRequiresImei} from "@/domain/mobileDevices";


interface MobileDeviceDetailsProps {
    mobileDevice?: MobileDeviceFormValues
    models: LookupOption[]
    isEditMode: boolean
}

export function MobileDeviceDetails({
                                        mobileDevice,
                                        models,
                                        isEditMode,
                                    }: MobileDeviceDetailsProps) {

    const initialSelectedModelId = mobileDevice?.model_id ?? null

    const [selectedModelId, setSelectedModelId] = useState<number | null>(initialSelectedModelId)

    const selectedModel = models.find((model) => model.id === selectedModelId)

    const shouldShowImeiField = mobileDeviceModelRequiresImei(selectedModel?.name)

    return (
        <Accordion label="Mobile Device Details"
                   id="mobileDeviceDetails"
        >
            <div>
                <Select label="Model"
                        name="model"
                        isRequired
                        items={models.map(model => (
                            {
                                id: model.id,
                                label: model.name,

                            }
                        ))}
                        isDisabled={isEditMode}
                        selectedKey={selectedModelId}
                        onSelectionChange={
                            (key) =>
                                setSelectedModelId(key == null ? null : Number(key))
                        }
                >
                </Select>

                {/* Passing model id through a hidden field since disabled fields won't be included in form data */}
                {isEditMode && mobileDevice && (
                    <input type="hidden"
                           name="model"
                           value={mobileDevice.model_id}
                    >
                    </input>
                )}

                {shouldShowImeiField && (
                    <TextField label="IMEI"
                               name="imei"
                               isRequired
                               isReadOnly={isEditMode}
                               validate={validateImeiField}
                               defaultValue={mobileDevice?.imei ?? undefined}
                    >
                    </TextField>
                )}

                <TextField label="Currently at Office Number"
                           name="officeNumber"
                           isRequired
                           validate={validateOfficeNumberField}
                           defaultValue={mobileDevice?.office_number}>
                </TextField>

                <TextArea label="Notes"
                          name="notes"
                          maxLength={200}
                          validate={validateNotesField}
                          defaultValue={mobileDevice?.notes ?? undefined}>
                </TextArea>
            </div>
        </Accordion>
    )
}
