import type {ReactNode} from "react";
import {ButtonGroup} from "@bcgov/design-system-react-components";


interface AssignmentLayoutProps {
    children: ReactNode
}

export function AssignmentSectionContent({
                                             children,
                                         }: AssignmentLayoutProps) {
    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            width: "100%",
            minWidth: 0,
        }}>
            {children}
        </div>
    )
}

export function AssignmentItem({
                                   children,
                               }: AssignmentLayoutProps) {
    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            width: "100%",
            minWidth: 0,
        }}>
            {children}
        </div>
    )
}

interface AssignmentActionRowProps {
    children: ReactNode
}

export function AssignmentActionRow({
                                        children,
                                    }: AssignmentActionRowProps) {
    return (
        <div style={{
            width: "100%",
            minWidth: 0,
        }}>
            <ButtonGroup>
                {children}
            </ButtonGroup>
        </div>
    )
}
