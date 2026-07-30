"use client";

import {Button, Select, Heading} from "@bcgov/design-system-react-components";
import {ModalDialog} from "@/components/ModalDialog";
import {useState} from "react";
import {validateOfficeNumberField} from "@/validators";

const reportOptions = [
    {id: "workspaces_by_office_code", label: "Workspaces (by Office Code)"},
    {id: "mobile_devices_by_office_code", label: "Mobile Devices (by Office Code)"},
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
        if (selectedReport !== "workspaces_by_office_code" && selectedReport !== "mobile_devices_by_office_code") {
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
            const endpoint = selectedReport === "mobile_devices_by_office_code"
                ? "/api/reports/mobile-devices"
                : "/api/reports/workspaces";
            const filename = selectedReport === "mobile_devices_by_office_code"
                ? `mobile-devices-${officeCode}.xlsx`
                : `workspaces-${officeCode}.xlsx`;

            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({officeCode}),
            });

            if (!response.ok) {
                const text = await response.text();
                let message = "Unable to generate report";

                try {
                    const body = JSON.parse(text);
                    message = body?.message || message;
                } catch {
                    message = text || message;
                }

                throw new Error(message);
            }

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = filename;
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

                {selectedReport === "mobile_devices_by_office_code" && (
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
                    isDisabled={(selectedReport === "workspaces_by_office_code" || selectedReport === "mobile_devices_by_office_code") && officeCode === ""}
                >
                    {isLoading ? "Generating..." : "Generate"}
                </Button>

            </div>
        </ModalDialog>
    );
}
