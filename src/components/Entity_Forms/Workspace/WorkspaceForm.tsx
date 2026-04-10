import {WorkspaceFields} from "@/components/Entity_Forms/Workspace/WorkspaceFields";
import {WorkspaceSearchResult} from "@/types";


interface WorkspaceFormProps {
    workspace: WorkspaceSearchResult;
    onHold: () => void
    onRemoveHold: () => void
}

export function WorkspaceForm({
                                  workspace,
                                  onHold,
                                  onRemoveHold,
                              }: WorkspaceFormProps) {

    return <WorkspaceFields workspace={workspace}
                            onHold={onHold}
                            onRemoveHold={onRemoveHold}>
    </WorkspaceFields>
}
