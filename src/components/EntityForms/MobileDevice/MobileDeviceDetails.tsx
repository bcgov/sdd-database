import {useState} from "react";
import {type CalendarDate, parseDate, today} from "@internationalized/date";

import {
    Accordion,
    DatePicker,
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
    validateOfficeNumberField,
    validateOrderDateField
} from "@/validators";

import {
    calculateMobileDevicePaymentEndDate,
    mobileDeviceModelRequiresImei,
    type MobileDeviceStatus
} from "@/domain/mobileDevices";


interface MobileDeviceDetailsProps {
    mobileDevice?: MobileDeviceSearchResult
    models: LookupOption[]

    isOfficeNumberReadOnly: boolean

    mobileDeviceStatus: MobileDeviceStatus
}

export function MobileDeviceDetails({
                                        mobileDevice,
                                        models,

                                        isOfficeNumberReadOnly,

                                        mobileDeviceStatus
                                    }: MobileDeviceDetailsProps) {

    const initialSelectedModelId = mobileDevice?.model_id ?? null

    const [selectedModelId, setSelectedModelId] = useState<number | null>(initialSelectedModelId)

    const selectedModel = models.find((model) => model.id === selectedModelId)

    const shouldShowImeiField = mobileDeviceModelRequiresImei(selectedModel?.name)

    const [draftMobileDeviceStatus, setDraftMobileDeviceStatus] = useState<MobileDeviceStatus>(mobileDeviceStatus)

    const isEditMode = !!mobileDevice

    const initialOrderDate = mobileDevice
        ? parseDate(mobileDevice.order_date.toISOString().slice(0, 10))
        : null

    const [orderDate, setOrderDate] = useState<CalendarDate | null>(initialOrderDate)

    const paymentEndDate = orderDate
        ? calculateMobileDevicePaymentEndDate(orderDate)
        : null

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

                <DatePicker label="Order Date"
                            name="orderDate"
                            firstDayOfWeek="mon"
                            showFormatHelpText={isEditMode}
                            isBrowserLocaleUsed
                            isRequired
                            isReadOnly={isEditMode}
                            value={orderDate}
                            onChange={setOrderDate}
                            maxValue={today("America/Vancouver")}
                            validate={validateOrderDateField}
                >
                </DatePicker>

                <DatePicker label="Payment End Date"
                            isCalendarDisabled
                            isBrowserLocaleUsed
                            showFormatHelpText={false}
                            isReadOnly
                            value={paymentEndDate}
                            description="This date is automatically calculated as 36 months after the Order Date"
                >
                </DatePicker>

                <div style={{width: "fit-content", marginBottom: "0.5rem"}}>
                    <ToggleButtonGroup label="Status (required)"
                                       aria-label="Status (required)"
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
