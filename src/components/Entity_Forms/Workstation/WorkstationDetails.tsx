import {Accordion, TextArea, TextField} from "@bcgov/design-system-react-components";
import {WorkstationSearchResult} from "@/types";


interface WorkstationDetailsProps {
    workstation: WorkstationSearchResult
}

export function WorkstationDetails({
                                       workstation,
                                   }: WorkstationDetailsProps) {
    return (
        <Accordion label="Workstation Details" id="workstationDetails">
            <TextField label="Asset Tag"
                       name="assetTag"
                       isReadOnly
                       defaultValue={workstation.asset_tag}>
            </TextField>

            <TextArea label="Notes"
                      name="notes"
                      maxLength={2000}
                      isReadOnly
                      defaultValue={workstation.notes ?? undefined}/>
        </Accordion>
    )
}
