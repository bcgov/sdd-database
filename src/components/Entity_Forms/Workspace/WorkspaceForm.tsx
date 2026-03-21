import type {Workspace} from "@/generated/prisma/client";
import {WorkspaceFields} from "@/components/Entity_Forms/Workspace/WorkspaceFields";


interface WorkspaceFormProps {
    workspace: Workspace;
}

export function WorkspaceForm({workspace}: WorkspaceFormProps) {
    return <WorkspaceFields workspace={workspace}/>;
}