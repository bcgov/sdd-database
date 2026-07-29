import {WorkspaceSearchResult} from "@/types";
import {AccordionGroup, Form} from "@bcgov/design-system-react-components";
import {WorkspaceDetails} from "@/components/EntityForms/Workspace/WorkspaceDetails";
import {WorkspaceProtections} from "@/components/EntityForms/Workspace/WorkspaceProtections";
import {AssignedEmployeeDetails} from "@/components/EntityForms/Shared/AssignedEmployeeDetails";
import {canHoldWorkspace, canRemoveWorkspaceHold, getWorkspaceStatus} from "@/domain/workspaces";
import {updateWorkspaceAction} from "@/actions/entities/workspaces";
import {useEntityFormActionState} from "@/hooks/entity/useEntityFormActionState";
import {FormActionButtons} from "@/components/EntityForms/Shared/FormActionButtons";

interface WorkspaceFormProps {
    workspace: WorkspaceSearchResult
    onHold: () => void
    onRemoveHold: () => void

    onSuccess: () => void
    onError: (error: string) => void
    onClose: () => void
}

export function WorkspaceForm({
                                workspace,
                                onHold,
                                onRemoveHold,                                
                                onSuccess,
                                onError,
                                onClose
                              }: WorkspaceFormProps) {

    const isEditMode = !!workspace
    const serverAction = updateWorkspaceAction
    
    const { formAction, isPending } = useEntityFormActionState({
        serverAction,
        onSuccess,
        onError
    })

    const workspaceStatus = getWorkspaceStatus(workspace)

    const restrictedProgramArea = workspace.restricted_program_area
    const restrictedBranch = restrictedProgramArea?.branch

    return (
        <Form action={formAction}>
            {/* pass workspace identifiers through FormData in edit mode */}
            {isEditMode && workspace?.office_number !== undefined && workspace?.workspace_number !== undefined
                ? (
                    <>
                        <input type="hidden" name="officeNumber" value={workspace.office_number} />
                        <input type="hidden" name="workspaceNumber" value={workspace.workspace_number} />
                    </>
                )
                : null
            }
            <div style={{
                maxHeight: "88vh",
                overflowY: "auto",
                paddingRight: "0.5rem",
            }}
            >
                <AccordionGroup allowsMultipleExpanded
                                defaultExpandedKeys={["workspaceDetails", "assignedEmployeeDetails"]}
                                style={{
                                    marginTop: "1rem",
                                    marginBottom: "1rem",
                                }}>
                    <WorkspaceDetails workspace={workspace}
                                    workspaceStatus={workspaceStatus}
                                    canHold={canHoldWorkspace(workspaceStatus)}
                                    canRemoveHold={canRemoveWorkspaceHold(workspaceStatus)}
                                    onHold={onHold}
                                    onRemoveHold={onRemoveHold}>
                    </WorkspaceDetails>

                    {restrictedProgramArea && restrictedBranch && (
                        <WorkspaceProtections branchId={restrictedBranch.id}
                                            branchName={restrictedBranch.name}
                                            programAreaId={restrictedProgramArea.id}
                                            programAreaName={restrictedProgramArea.name}>
                        </WorkspaceProtections>

                    )}

                    {workspace.assigned_employee &&
                        (<AssignedEmployeeDetails assignedEmployee={workspace.assigned_employee}/>)}
                </AccordionGroup>
            </div>
            <FormActionButtons isEditMode={isEditMode}
                               isPending={isPending}
                               onClose={onClose}
            >
            </FormActionButtons>
        </Form>
        

            
    )
}
