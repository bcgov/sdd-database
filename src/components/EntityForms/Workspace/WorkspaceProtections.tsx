import {Accordion, Callout, Select} from "@bcgov/design-system-react-components";

interface WorkspaceProtectionsProps {
    branchId: number
    branchName: string
    programAreaId: number
    programAreaName: string
}

export function WorkspaceProtections({
    branchId,
    branchName,
    programAreaId,
    programAreaName,
}: WorkspaceProtectionsProps) {
    return (
            <Accordion label="Workspace Protections" id="workspaceProtections">
                <div>
                    <div style={{
                        marginBottom: "1rem",
                    }}>
                        <Callout description="This workspace can only be assigned to employees in the Branch and Program Area shown below">
                        </Callout>
                    </div>
                    <Select label="Branch"
                            items={[
                                {
                                    id: branchId,
                                    label: branchName,
                                }
                            ]}
                            isDisabled
                            defaultValue={branchId}>
                    </Select>

                    <Select label="Program Area"
                            items={[
                                {
                                    id: programAreaId,
                                    label: programAreaName,
                                }
                            ]}
                            isDisabled
                            defaultValue={programAreaId}>
                    </Select>
                </div>
            </Accordion>
    )
}
