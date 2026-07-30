"use client";

import {Button, Select, Heading} from "@bcgov/design-system-react-components";
import {ModalDialog} from "@/components/ModalDialog";
import {useState} from "react";
import {validateAssetTagField, validateOfficeNumberField} from "@/validators";

const reportOptions = [
    {id: "workspaces_by_office_code", label: "Workspaces (by Office Code)"},
    {id: "mobile_devices_by_office_code", label: "Mobile Devices (by Office Code)"},
    {id: "workstation_assets_by_asset_number", label: "Workstation Asset (by Asset Number)"},
];

export function ReportsModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedReport, setSelectedReport] = useState<string>(reportOptions[0].id);
    const [officeCode, setOfficeCode] = useState<string>("");
    const [assetNumber, setAssetNumber] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerate = async () => {
        if (selectedReport === "workstation_assets_by_asset_number") {
            const validationError = validateAssetTagField(assetNumber, "Asset number");
            if (validationError) {
                setError(validationError);
                return;
            }
        } else if (selectedReport === "workspaces_by_office_code" || selectedReport === "mobile_devices_by_office_code") {
            const validationError = validateOfficeNumberField(officeCode, "Office code");
            if (validationError) {
                setError(validationError);
                return;
            }
        } else {
            setError(null);
            return;
        }

        setError(null);
        setIsLoading(true);

        try {
            const endpoint = selectedReport === "mobile_devices_by_office_code"
                ? "/api/reports/mobile-devices"
                : selectedReport === "workstation_assets_by_asset_number"
                    ? "/api/reports/workstations"
                    : "/api/reports/workspaces";
            const filename = selectedReport === "mobile_devices_by_office_code"
                ? `mobile-devices-${officeCode}.xlsx`
                : selectedReport === "workstation_assets_by_asset_number"
                    ? `workstations-${assetNumber}.xlsx`
                    : `workspaces-${officeCode}.xlsx`;
            const body = selectedReport === "workstation_assets_by_asset_number"
                ? JSON.stringify({assetTag: assetNumber.trim()})
                : JSON.stringify({officeCode});

            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body,
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
                            setOfficeCode("");
                            setAssetNumber("");
                            setError(null);
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

                {selectedReport === "workstation_assets_by_asset_number" && (
                    <div style={{display: "flex", flexDirection: "column", gap: "0.5rem"}}>
                        <label htmlFor="Asset Number">Asset Tag</label>
                        <input
                            id="assetNumber"
                            name="assetNumber"
                            type="text"
                            value={assetNumber}
                            onChange={(event) => setAssetNumber(event.target.value)}
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
                    isDisabled={
                        (selectedReport === "workspaces_by_office_code" || selectedReport === "mobile_devices_by_office_code")
                            ? officeCode === ""
                            : selectedReport === "workstation_assets_by_asset_number"
                                ? assetNumber === ""
                                : false
                    }
                >
                    {isLoading ? "Generating..." : "Generate"}
                </Button>

            </div>
        </ModalDialog>
    );
}
