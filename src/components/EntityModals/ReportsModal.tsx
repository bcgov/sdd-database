"use client";

import {Button, Select, Heading} from "@bcgov/design-system-react-components";
import {ModalDialog} from "@/components/ModalDialog";
import {useState} from "react";
import {validateOfficeNumberField} from "@/validators";

const reportOptions = [
    {id: "workspaces_by_office_code", label: "Workspaces (by Office Code)"},
    {id: "placeholder_report_1", label: "Placeholder report 1"},
    {id: "placeholder_report_2", label: "Placeholder report 2"},
    {id: "placeholder_report_3", label: "Placeholder report 3"},
];

export function ReportsModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedReport, setSelectedReport] = useState<string>(reportOptions[0].id);
    const [officeCode, setOfficeCode] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerate = async () => {
        if (selectedReport !== "workspaces_by_office_code") {
            setError(null);
            return;
        }

        const validationError = validateOfficeNumberField(officeCode, "Office code");
        if (validationError) {
            setError(validationError);
            return;
        }

        setError(null);
        setIsLoading(true);

        try {
            const response = await fetch("/api/reports/workspaces", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({officeCode}),
            });

            if (!response.ok) {
                const body = await response.json().catch(() => null);
                throw new Error(body?.message || "Unable to generate report");
            }

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `workspaces-${officeCode}.xlsx`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            URL.revokeObjectURL(url);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Unable to generate report");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <ModalDialog
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            triggerButtonText="Reports"
            modalTitle="Reports"
        >
            <div style={{display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1rem"}}>
                <Heading level={5}>Select a report</Heading>
                <Select
                    label="Report type"
                    name="reportType"
                    items={reportOptions}
                    selectedKey={selectedReport}
                    onSelectionChange={(key) => {
                        if (key != null) {
                            const selection = key.toString();
                            setSelectedReport(selection);
                            if (selection !== "workspaces_by_office_code") {
                                setOfficeCode("");
                                setError(null);
                            }
                        }
                    }}
                />

                {selectedReport === "workspaces_by_office_code" && (
                    <div style={{display: "flex", flexDirection: "column", gap: "0.5rem"}}>
                        <label htmlFor="officeCode">Office code</label>
                        <input
                            id="officeCode"
                            name="officeCode"
                            type="text"
                            value={officeCode}
                            onChange={(event) => setOfficeCode(event.target.value)}
                            style={{padding: "0.5rem", fontSize: "1rem", border: "1px solid #d1d1d1", borderRadius: "4px"}}
                        />
                    </div>
                )}

                {error && (
                    <div style={{color: "red"}}>{error}</div>
                )}

                <Button
                    type="button"
                    variant="secondary"
                    onPress={handleGenerate}
                    isDisabled={selectedReport === "workspaces_by_office_code" && officeCode === ""}
                >
                    {isLoading ? "Generating..." : "Generate"}
                </Button>

            </div>
        </ModalDialog>
    );
}
