import {Accordion, TextArea, TextField} from "@bcgov/design-system-react-components";
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
            <TextField label="Asset Tag"
                       name="assetTag"
                       isReadOnly
                       defaultValue={workstation.asset_tag}>
            </TextField>

            {hasNotes && <TextArea label="Notes"
                      name="notes"
                      maxLength={2000}
                      isReadOnly
                      defaultValue={workstation.notes ?? undefined}>
            </TextArea>}
        </Accordion>
    )
}
