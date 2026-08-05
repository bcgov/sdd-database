import { EmployeeFormValues } from "@/types";
import { getWorkstationsByAssetTags } from "@/db/data-access/workstations";
import { getWorkspaceByOfficeAndWorkspaceNumber } from "@/db/data-access/workspaces";
import {
  validateEmployeeIdField,
  validateEmployeeIdirField,
  validateEmployeeJobTitleField,
  validateEmployeeNameField,
  validateEmployeeProgramAreaField,
  validateNotesField,
  validateOfficeNumberField,
} from "@/validators";
import {
  getBranchNameByProgramAreaId,
  getWorkspaceAssignmentTypeNameById,
} from "@/db/data-access/lookups";
import { getMobileDeviceById } from "@/db/data-access/mobileDevices";

export async function validateEmployeeData(employee: EmployeeFormValues) {
  const fieldValidationError =
    validateOfficeNumberField(employee.office_number) ??
    (employee.idir ? validateEmployeeIdirField(employee.idir) : undefined) ??
    validateEmployeeNameField(employee.first_name, "First Name") ??
    (employee.alternate_name
      ? validateEmployeeNameField(employee.alternate_name, "Alternate Name", {
          required: false,
        })
      : undefined) ??
    validateEmployeeNameField(employee.last_name, "Last Name") ??
    (employee.employee_id
      ? validateEmployeeIdField(employee.employee_id)
      : undefined) ??
    validateEmployeeProgramAreaField(
      employee.program_area_id,
      "Program Area",
    ) ??
    (employee.notes ? validateNotesField(employee.notes) : undefined);

  if (fieldValidationError) {
    return fieldValidationError;
  }

  const branchName = await getBranchNameByProgramAreaId(
    employee.program_area_id,
  );
  if (!branchName) {
    return `The selected Program Area is invalid. Please reselect a Program Area and try again.`;
  }

  if (branchName !== "Non SDD") {
    const jobValidationError = validateEmployeeJobTitleField(
      employee.job_title_id,
      "Job Title",
    );
    if (jobValidationError) {
      return jobValidationError;
    }
  }

  const workspaceAssignmentTypeValidationError =
    await validateWorkspaceAssignmentTypeRules(employee);
  if (workspaceAssignmentTypeValidationError) {
    return workspaceAssignmentTypeValidationError;
  }

  const workspaceValidationError = await validateAssignedWorkspace(employee);
  if (workspaceValidationError) {
    return workspaceValidationError;
  }

  const workstationValidationError =
    await validateAssignedWorkstations(employee);
  if (workstationValidationError) {
    return workstationValidationError;
  }

  const mobileDeviceValidationError =
    await validateAssignedMobileDevice(employee);
  if (mobileDeviceValidationError) {
    return mobileDeviceValidationError;
  }
}

async function validateWorkspaceAssignmentTypeRules(
  employee: EmployeeFormValues,
) {
  const workspaceAssignmentTypeId = employee.workspace_assignment_type_id;

  if (!employee.is_on_leave && workspaceAssignmentTypeId == null) {
    return `Please select a Workspace Assignment Type.`;
  }

  if (workspaceAssignmentTypeId == null) return;

  const workspaceAssignmentTypeName = await getWorkspaceAssignmentTypeNameById(
    workspaceAssignmentTypeId,
  );

  if (!workspaceAssignmentTypeName) {
    return `The selected Workspace Assignment Type is invalid. Please reselect a Workspace Assignment Type and try again`;
  }

  if (
    workspaceAssignmentTypeName === "Resident" &&
    !employee.ui_workspace_number
  ) {
    return `No workspace assigned for resident employee. Please assign a workspace or change the Workspace Assignment Type and try again.`;
  }
}

async function validateAssignedWorkspace(employee: EmployeeFormValues) {
  const workspaceNumber = employee.ui_workspace_number;

  if (!workspaceNumber) return;

  const workspace = await getWorkspaceByOfficeAndWorkspaceNumber(
    employee.office_number,
    workspaceNumber,
  );

  if (!workspace) {
    return `The selected workspace no longer exists for Office ${employee.office_number}. Please reassign a workspace and try again.`;
  }

  if (!workspace.is_on_hold && workspace.employee_id !== employee.id) {
    return `Workspace ${workspaceNumber} is no longer on hold and cannot be assigned. Please choose another workspace.`;
  }

  if (workspace.employee_id != null && workspace.employee_id !== employee.id) {
    return `Workspace ${workspaceNumber} is already assigned to another employee. Please choose another workspace.`;
  }

  if (
    workspace.restricted_program_area_id != null &&
    workspace.restricted_program_area_id !== employee.program_area_id
  ) {
    return `Workspace ${workspaceNumber} is restricted to a different Program Area. Please choose another workspace.`;
  }
}

async function validateAssignedWorkstations(employee: EmployeeFormValues) {
  const workstationAssetTags = employee.ui_workstation_asset_tags ?? [];

  if (workstationAssetTags.length === 0) return;

  const workstations = await getWorkstationsByAssetTags(workstationAssetTags);

  if (workstations.length !== workstationAssetTags.length) {
    return `One or more selected workstations no longer exist. Please refresh the page and try again.`;
  }

  const conflictingWorkstation = workstations.find(
    (workstation) =>
      workstation.employee_id != null &&
      workstation.employee_id !== employee.id,
  );

  if (conflictingWorkstation) {
    return `Workstation ${conflictingWorkstation.asset_tag} is already assigned to another employee. Please choose another workstation.`;
  }
}

async function validateAssignedMobileDevice(employee: EmployeeFormValues) {
  const mobileDeviceId = employee.ui_mobile_device_id;

  if (mobileDeviceId === undefined) return;

  const mobileDevice = await getMobileDeviceById(mobileDeviceId);

  if (!mobileDevice) {
    return `The selected mobile device no longer exists. Please refresh the page and try again.`;
  }

  if (mobileDevice.adr || mobileDevice.gilr) {
    return `The selected mobile device is marked as disposed or lost/stolen and cannot be assigned. Please choose another mobile device.`;
  }

  if (
    mobileDevice.employee_id != null &&
    mobileDevice.employee_id !== employee.id
  ) {
    return `The selected mobile device is already assigned to another employee. Please choose another mobile device.`;
  }
}
