"use client";

import {Button, Select, Heading} from "@bcgov/design-system-react-components";
import {ModalDialog} from "@/components/ModalDialog";
import {useEffect, useState} from "react";
import {validateAssetTagField, validateOfficeNumberField} from "@/validators";

const reportOptions = [
    {id: "employees_by_name_or_idir", label: "Employee (by Name or IDIR)"},
    {id: "employees_by_branch_or_program_area", label: "Employees (by Branch or Program Area)"},
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
    const [employeeQuery, setEmployeeQuery] = useState<string>("");
    const [selectedBranchId, setSelectedBranchId] = useState<string>("");
    const [selectedProgramAreaId, setSelectedProgramAreaId] = useState<string>("");
    const [selectedOfficeCode, setSelectedOfficeCode] = useState<string>("");
    const [selectedJobTitleId, setSelectedJobTitleId] = useState<string>("");
    const [branchOptions, setBranchOptions] = useState<Array<{id: string; label: string}>>([]);
    const [allProgramAreaOptions, setAllProgramAreaOptions] = useState<Array<{id: string; label: string; branchId: string}>>([]);
    const [jobTitleOptions, setJobTitleOptions] = useState<Array<{id: string; label: string}>>([]);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const visibleProgramAreaOptions = selectedBranchId
        ? allProgramAreaOptions.filter((option) => option.branchId === selectedBranchId)
        : allProgramAreaOptions;

    useEffect(() => {
        const loadFilterOptions = async () => {
            if (selectedReport !== "employees_by_branch_or_program_area") {
                return;
            }

            try {
                const response = await fetch("/api/reports/employee-filters");
                if (!response.ok) {
                    throw new Error("Unable to load branch and program area options");
                }

                const data = await response.json();
                setBranchOptions(data.branches.map((branch: {id: number; name: string}) => ({id: branch.id.toString(), label: branch.name})));
                setAllProgramAreaOptions(data.programAreas.map((programArea: {id: number; name: string; branch_id: number}) => ({
                    id: programArea.id.toString(),
                    label: programArea.name,
                    branchId: programArea.branch_id.toString(),
                })));
                setJobTitleOptions(data.jobTitles.map((jobTitle: {id: number; name: string}) => ({id: jobTitle.id.toString(), label: jobTitle.name})));
            } catch (e) {
                setError(e instanceof Error ? e.message : "Unable to load branch and program area options");
            }
        };

        if (isOpen) {
            void loadFilterOptions();
        }
    }, [isOpen, selectedReport]);

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
        } else if (selectedReport === "employees_by_name_or_idir") {
            if (!employeeQuery.trim()) {
                setError("Name or IDIR is required");
                return;
            }
        } else if (selectedReport === "employees_by_branch_or_program_area") {
            if (!selectedBranchId && !selectedProgramAreaId) {
                setError("Branch or program area is required");
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
                    : selectedReport === "employees_by_name_or_idir" || selectedReport === "employees_by_branch_or_program_area"
                        ? "/api/reports/employees"
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
                        : selectedReport === "employees_by_name_or_idir"
                            ? `employees-${employeeQuery}.xlsx`
                            : selectedReport === "employees_by_branch_or_program_area"
                                ? `employees-branch-program-area.xlsx`
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
                            : selectedReport === "employees_by_name_or_idir"
                                ? JSON.stringify({query: employeeQuery.trim()})
                                : selectedReport === "employees_by_branch_or_program_area"
                                    ? JSON.stringify({branchId: selectedBranchId || undefined, programAreaId: selectedProgramAreaId || undefined, officeCode: selectedOfficeCode.trim() || undefined, jobTitleId: selectedJobTitleId || undefined, mode: "branch_or_program_area"})
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
                            setEmployeeQuery("");
                            setSelectedBranchId("");
                            setSelectedProgramAreaId("");
                            setSelectedOfficeCode("");
                            setSelectedJobTitleId("");
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

                {selectedReport === "employees_by_name_or_idir" && (
                    <div style={{display: "flex", flexDirection: "column", gap: "0.5rem"}}>
                        <label htmlFor="employeeQuery">Name or IDIR</label>
                        <input
                            id="employeeQuery"
                            name="employeeQuery"
                            type="text"
                            value={employeeQuery}
                            onChange={(event) => setEmployeeQuery(event.target.value)}
                            style={{padding: "0.5rem", fontSize: "1rem", border: "1px solid #d1d1d1", borderRadius: "4px"}}
                        />
                    </div>
                )}

                {selectedReport === "employees_by_branch_or_program_area" && (
                    <div style={{display: "flex", flexDirection: "column", gap: "0.75rem"}}>
                        <div style={{display: "flex", flexDirection: "column", gap: "0.5rem"}}>
                            <label htmlFor="branchSelect">Branch</label>
                            <Select
                                name="branchSelect"
                                items={branchOptions}
                                selectedKey={selectedBranchId}
                                onSelectionChange={(key) => {
                                    const nextValue = key?.toString() ?? "";
                                    setSelectedBranchId(nextValue);
                                    setSelectedProgramAreaId("");
                                }}
                            />
                        </div>
                        <div style={{display: "flex", flexDirection: "column", gap: "0.5rem"}}>
                            <label htmlFor="programAreaSelect">Program Area</label>
                            <Select
                                name="programAreaSelect"
                                items={visibleProgramAreaOptions}
                                selectedKey={selectedProgramAreaId}
                                onSelectionChange={(key) => {
                                    setSelectedProgramAreaId(key?.toString() ?? "");
                                }}
                            />
                        </div>
                        <div style={{display: "flex", flexDirection: "column", gap: "0.5rem"}}>
                            <label htmlFor="officeCodeSelect">Office Code (optional)</label>
                            <input
                                id="officeCodeSelect"
                                name="officeCodeSelect"
                                type="text"
                                value={selectedOfficeCode}
                                onChange={(event) => setSelectedOfficeCode(event.target.value)}
                                style={{padding: "0.5rem", fontSize: "1rem", border: "1px solid #d1d1d1", borderRadius: "4px"}}
                            />
                        </div>
                        <div style={{display: "flex", flexDirection: "column", gap: "0.5rem"}}>
                            <label htmlFor="jobTitleSelect">Job Title (optional)</label>
                            <Select
                                name="jobTitleSelect"
                                items={jobTitleOptions}
                                selectedKey={selectedJobTitleId}
                                onSelectionChange={(key) => {
                                    setSelectedJobTitleId(key?.toString() ?? "");
                                }}
                            />
                        </div>
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
                                    : selectedReport === "employees_by_name_or_idir"
                                        ? employeeQuery === ""
                                        : selectedReport === "employees_by_branch_or_program_area"
                                            ? selectedBranchId === "" && selectedProgramAreaId === ""
                                            : false
                    }
                >
                    {isLoading ? "Generating..." : "Generate"}
                </Button>

            </div>
        </ModalDialog>
    );
}
