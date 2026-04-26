import {Accordion, Select, TextArea, TextField} from "@bcgov/design-system-react-components";
import {WorkstationSearchResult} from "@/types";


interface WorkstationDetailsProps {
    workstation: WorkstationSearchResult
}

export function WorkstationDetails({
                                       workstation,
                                   }: WorkstationDetailsProps) {

    const hasNotes = !!workstation.notes

    return (
        <Accordion label="Workstation Details" id="workstationDetails">
            <div>
                <TextField label="Asset Tag"
                           name="assetTag"
                           isReadOnly
                           defaultValue={workstation.asset_tag}>
                </TextField>

                <Select label="Model"
                        items={[
                            {
                                id: workstation.model_id,
                                label: workstation.workstation_model.name
                            }
                        ]}
                        isDisabled
                        selectedKey={workstation.model_id}>
                </Select>

                <TextField label="Currently at Office Number"
                           isReadOnly
                           defaultValue={workstation.office_number}>
                </TextField>

                {hasNotes &&
                    <TextArea label="Notes"
                              name="notes"
                              maxLength={2000}
                              isReadOnly
                              defaultValue={workstation.notes ?? undefined}>
                    </TextArea>}
            </div>
        </Accordion>
    )
}
