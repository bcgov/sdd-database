import {WorkspaceFields} from "@/components/Entity_Forms/Workspace/WorkspaceFields";
import {WorkspaceSearchResult} from "@/types";


interface WorkspaceFormProps {
    workspace: WorkspaceSearchResult;
}

export function WorkspaceForm({workspace}: WorkspaceFormProps) {
    return <WorkspaceFields workspace={workspace}/>;
}
