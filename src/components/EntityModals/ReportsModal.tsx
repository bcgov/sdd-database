"use client";

import {Button, Select, Heading} from "@bcgov/design-system-react-components";
import {ModalDialog} from "@/components/ModalDialog";
import {useState} from "react";
import {validateAssetTagField, validateOfficeNumberField} from "@/validators";

const reportOptions = [
    {id: "workspace_holds_by_office_code_and_status", label: "Workspace Holds (by Office Code, availability, and Hold Status)"},
    {id: "workspaces_by_office_code", label: "Workspaces (by Office Code)"},
    {id: "mobile_devices_by_office_code", label: "Mobile Devices (by Office Code)"},
    {id: "mobile_devices_by_imei", label: "Mobile Devices (by IMEI)"},
    {id: "workstation_assets_by_asset_number", label: "Workstation Asset (by Asset Number)"},
    {id: "workstation_assets_by_office_code_and_model", label: "Workstation Asset (by Office Code and Model)"},
];

export function ReportsModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedReport, setSelectedReport] = useState<string>(reportOptions[0].id);
    const [officeCode, setOfficeCode] = useState<string>("");
    const [assetNumber, setAssetNumber] = useState<string>("");
    const [modelName, setModelName] = useState<string>("");
    const [imei, setImei] = useState<string>("");
    const [availabilityStatus, setAvailabilityStatus] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerate = async () => {
        if (selectedReport === "workstation_assets_by_asset_number") {
            const validationError = validateAssetTagField(assetNumber, "Asset number");
            if (validationError) {
                setError(validationError);
                return;
            }
        } else if (selectedReport === "workstation_assets_by_office_code_and_model") {
            const officeValidationError = validateOfficeNumberField(officeCode, "Office code");
            if (officeValidationError) {
                setError(officeValidationError);
                return;
            }
        } else if (selectedReport === "mobile_devices_by_imei") {
            if (!imei.trim()) {
                setError("IMEI is required");
                return;
            }
        } else if (selectedReport === "workspace_holds_by_office_code_and_status") {
            if (!officeCode.trim()) {
                setError("Office code is required");
                return;
            }
            if (!availabilityStatus) {
                setError("Availability is required");
                return;
            }
        } else if (selectedReport === "workspaces_by_office_code" || selectedReport === "mobile_devices_by_office_code") {
            setError(null);
        } else {
            setError(null);
            return;
        }

        setError(null);
        setIsLoading(true);

        try {
            const endpoint = selectedReport === "mobile_devices_by_office_code" || selectedReport === "mobile_devices_by_imei"
                ? "/api/reports/mobile-devices"
                : selectedReport === "workspace_holds_by_office_code_and_status"
                    ? "/api/reports/workspaces"
                    : selectedReport === "workstation_assets_by_asset_number"
                        ? "/api/reports/workstations"
                        : selectedReport === "workstation_assets_by_office_code_and_model"
                            ? "/api/reports/workstations"
                            : "/api/reports/workspaces";
            const filename = selectedReport === "mobile_devices_by_office_code"
                ? `mobile-devices-${officeCode}.xlsx`
                : selectedReport === "mobile_devices_by_imei"
                    ? `mobile-devices-${imei}.xlsx`
                    : selectedReport === "workspace_holds_by_office_code_and_status"
                        ? `workspace-holds-${officeCode}-${availabilityStatus}.xlsx`
                        : selectedReport === "workstation_assets_by_asset_number"
                            ? `workstations-${assetNumber}.xlsx`
                            : selectedReport === "workstation_assets_by_office_code_and_model"
                                ? `workstations-${officeCode}-${modelName || "all"}.xlsx`
                                : `workspaces-${officeCode}.xlsx`;
            const body = selectedReport === "workstation_assets_by_asset_number"
                ? JSON.stringify({assetTag: assetNumber.trim()})
                : selectedReport === "workstation_assets_by_office_code_and_model"
                    ? JSON.stringify({officeCode, modelName: modelName.trim() || undefined})
                    : selectedReport === "mobile_devices_by_imei"
                        ? JSON.stringify({imei: imei.trim()})
                        : selectedReport === "workspace_holds_by_office_code_and_status"
                            ? JSON.stringify({officeCode, availability: availabilityStatus})
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
                            setModelName("");
                            setImei("");
                            setAvailabilityStatus("");
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

                {selectedReport === "mobile_devices_by_imei" && (
                    <div style={{display: "flex", flexDirection: "column", gap: "0.5rem"}}>
                        <label htmlFor="imei">IMEI</label>
                        <input
                            id="imei"
                            name="imei"
                            type="text"
                            value={imei}
                            onChange={(event) => setImei(event.target.value)}
                            style={{padding: "0.5rem", fontSize: "1rem", border: "1px solid #d1d1d1", borderRadius: "4px"}}
                        />
                    </div>
                )}

                {selectedReport === "workspace_holds_by_office_code_and_status" && (
                    <div style={{display: "flex", flexDirection: "column", gap: "0.75rem"}}>
                        <div style={{display: "flex", flexDirection: "column", gap: "0.5rem"}}>
                            <label htmlFor="workspaceHoldOfficeCode">Office code</label>
                            <input
                                id="workspaceHoldOfficeCode"
                                name="workspaceHoldOfficeCode"
                                type="text"
                                value={officeCode}
                                onChange={(event) => setOfficeCode(event.target.value)}
                                style={{padding: "0.5rem", fontSize: "1rem", border: "1px solid #d1d1d1", borderRadius: "4px"}}
                            />
                        </div>
                        <div style={{display: "flex", flexDirection: "column", gap: "0.5rem"}}>
                            <label htmlFor="availabilityStatus">Availability</label>
                            <select
                                id="availabilityStatus"
                                name="availabilityStatus"
                                value={availabilityStatus}
                                onChange={(event) => setAvailabilityStatus(event.target.value)}
                                style={{padding: "0.5rem", fontSize: "1rem", border: "1px solid #d1d1d1", borderRadius: "4px"}}
                            >
                                <option value="">Select...</option>
                                <option value="available">Available</option>
                                <option value="occupied">Occupied</option>
                                <option value="onHold">On Hold</option>
                            </select>
                        </div>
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

                {selectedReport === "workstation_assets_by_office_code_and_model" && (
                    <div style={{display: "flex", flexDirection: "column", gap: "0.75rem"}}>
                        <div style={{display: "flex", flexDirection: "column", gap: "0.5rem"}}>
                            <label htmlFor="officeCodeModel">Office code</label>
                            <input
                                id="officeCodeModel"
                                name="officeCodeModel"
                                type="text"
                                value={officeCode}
                                onChange={(event) => setOfficeCode(event.target.value)}
                                style={{padding: "0.5rem", fontSize: "1rem", border: "1px solid #d1d1d1", borderRadius: "4px"}}
                            />
                        </div>
                        <div style={{display: "flex", flexDirection: "column", gap: "0.5rem"}}>
                            <label htmlFor="modelName">Model (optional)</label>
                            <input
                                id="modelName"
                                name="modelName"
                                type="text"
                                value={modelName}
                                onChange={(event) => setModelName(event.target.value)}
                                style={{padding: "0.5rem", fontSize: "1rem", border: "1px solid #d1d1d1", borderRadius: "4px"}}
                            />
                        </div>
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
                        selectedReport === "workstation_assets_by_asset_number"
                            ? assetNumber === ""
                            : selectedReport === "mobile_devices_by_imei"
                                ? imei === ""
                                : selectedReport === "workspace_holds_by_office_code_and_status"
                                    ? officeCode === "" || availabilityStatus === ""
                                    : false
                    }
                >
                    {isLoading ? "Generating..." : "Generate"}
                </Button>

            </div>
        </ModalDialog>
    );
}
