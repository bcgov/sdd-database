import {Accordion, Button, TextField} from "@bcgov/design-system-react-components";
import {PressEvent} from "@react-types/shared";


interface WorkstationDetailsProps {
    workstationAssetTags: string[]
    handleAssignWorkstation: (e: PressEvent) => Promise<void>
    handleRemoveWorkstation: (assetTag: string) => void
}

export function WorkstationDetails({
                                       workstationAssetTags,
                                       handleAssignWorkstation,
                                       handleRemoveWorkstation,
                                   }: WorkstationDetailsProps) {

    const hasWorkstations = workstationAssetTags.length > 0

    return (
        <Accordion label="Workstation Details" id="workstationDetails">
            <div>
                {workstationAssetTags.map((assetTag) => (
                    <div key={assetTag}>
                        <TextField label="Asset Tag"
                                   name="workstationAssetTags"
                                   isReadOnly
                                   value={assetTag}
                        >
                        </TextField>

                        <Button
                            variant="secondary"
                            danger
                            onPress={() => handleRemoveWorkstation(assetTag)}
                        >
                            Remove Workstation
                        </Button>
                    </div>
                ))}

                <Button variant="secondary"
                        onPress={handleAssignWorkstation}>
                    {hasWorkstations ? "Add Workstation" : "Assign Workstation"}
                </Button>
            </div>
        </Accordion>
    )
}
