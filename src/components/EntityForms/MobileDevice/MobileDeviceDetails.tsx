import {
    Accordion,
    Select,
    TextArea,
    TextField,
    ToggleButton,
    ToggleButtonGroup
} from "@bcgov/design-system-react-components";
import {LookupOption, MobileDeviceSearchResult} from "@/types";
import {
    validateAdrField,
    validateGilrField,
    validateImeiField,
    validateNotesField,
    validateOfficeNumberField
} from "@/validators";
import {useState} from "react";
import {
    mobileDeviceModelRequiresImei,
    MobileDeviceStatus
} from "@/domain/mobileDevices";


interface MobileDeviceDetailsProps {
    mobileDevice?: MobileDeviceSearchResult
    models: LookupOption[]

    isEditMode: boolean
    isOfficeNumberReadOnly: boolean

    mobileDeviceStatus: MobileDeviceStatus
}

export function MobileDeviceDetails({
                                        mobileDevice,
                                        models,

                                        isEditMode,
                                        isOfficeNumberReadOnly,

                                        mobileDeviceStatus
                                    }: MobileDeviceDetailsProps) {

    const initialSelectedModelId = mobileDevice?.model_id ?? null

    const [selectedModelId, setSelectedModelId] = useState<number | null>(initialSelectedModelId)

    const selectedModel = models.find((model) => model.id === selectedModelId)

    const shouldShowImeiField = mobileDeviceModelRequiresImei(selectedModel?.name)

    const [draftMobileDeviceStatus, setDraftMobileDeviceStatus] = useState<MobileDeviceStatus>(mobileDeviceStatus)

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
                           isReadOnly={isOfficeNumberReadOnly}
                           validate={validateOfficeNumberField}
                           defaultValue={mobileDevice?.office_number}>
                </TextField>

                <div style={{width: "fit-content", marginBottom: "0.5rem"}}>
                    <ToggleButtonGroup label="Status"
                                       disallowEmptySelection
                                       selectedKeys={[draftMobileDeviceStatus]}
                                       isDisabled={mobileDeviceStatus === "adr" || mobileDeviceStatus === "gilr" || mobileDeviceStatus === "assigned"}
                                       style={{width: "fit-content"}}
                    >
                        <ToggleButton id="unassigned"
                                      isDisabled={draftMobileDeviceStatus === "assigned"}
                                      onPress={() => setDraftMobileDeviceStatus("unassigned")}
                        >
                            Unassigned
                        </ToggleButton>

                        <ToggleButton id="assigned" isDisabled>Assigned</ToggleButton>

                        <ToggleButton id="adr"
                                      isDisabled={draftMobileDeviceStatus === "assigned"}
                                      onPress={() => setDraftMobileDeviceStatus("adr")}
                        >
                            Disposed
                        </ToggleButton>

                        <ToggleButton id="gilr"
                                      isDisabled={draftMobileDeviceStatus === "assigned"}
                                      onPress={() => setDraftMobileDeviceStatus("gilr")}
                        >
                            Lost / Stolen
                        </ToggleButton>
                    </ToggleButtonGroup>
                </div>

                <input type="hidden"
                       name="mobileDeviceStatus"
                       value={draftMobileDeviceStatus}
                />

                {draftMobileDeviceStatus === "adr" && (
                    <TextField label="Asset Disposal Report (ADR) Number"
                               name="adr"
                               isRequired
                               validate={validateAdrField}
                               defaultValue={mobileDevice?.adr ?? undefined}>
                    </TextField>
                )}

                {draftMobileDeviceStatus === "gilr" && (
                    <TextField label="General Incident Loss Report (GILR) Number"
                               name="gilr"
                               isRequired
                               validate={validateGilrField}
                               defaultValue={mobileDevice?.gilr ?? undefined}>
                    </TextField>
                )}

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
