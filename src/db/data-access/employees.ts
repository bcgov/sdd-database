import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/db/client";
import { EmployeeFormValues, EmployeeSearchResult } from "@/types";
import { employeeSearchResultArgs } from "@/db/data-access/searchResultArgs";

type DbClient = Prisma.TransactionClient;

export async function getEmployeesByFilter(
  query?: string,
): Promise<EmployeeSearchResult[]> {
  const searchFilter: Prisma.EmployeeWhereInput = query
    ? {
        OR: [
          { office_number: { contains: query } },
          { idir: { contains: query, mode: "insensitive" } },
          { first_name: { contains: query, mode: "insensitive" } },
          { alternate_name: { contains: query, mode: "insensitive" } },
          { last_name: { contains: query, mode: "insensitive" } },
          { employee_id: { contains: query, mode: "insensitive" } },
          // 🔎 match by Branch name via ProgramArea -> Branch using a relation filter
          {
            program_area: {
              branch: { name: { contains: query, mode: "insensitive" } },
            },
          },
          // 🔎 match by Program Area name
          { program_area: { name: { contains: query, mode: "insensitive" } } },
          { job_title: { name: { contains: query, mode: "insensitive" } } },
          { notes: { contains: query, mode: "insensitive" } },
          {
            workspace_assignment_type: {
              name: { contains: query, mode: "insensitive" },
            },
          },
          {
            ohs_accommodations: {
              some: {
                ohs_accommodation_type: {
                  name: { contains: query, mode: "insensitive" },
                },
              },
            },
          },
        ],
      }
    : {};

  return prisma.employee.findMany({
    where: searchFilter,
    ...employeeSearchResultArgs,
    orderBy: [
      { first_name: "asc" },
      { last_name: "asc" },
      { alternate_name: "asc" },
    ],
  });
}

async function addNewEmployee(db: DbClient, employee: EmployeeFormValues) {
  const {
    // parseEmployeeFormData will pass undefined for id
    id,

    ui_branch_id,
    ui_workspace_number,
    ui_workstation_asset_tags,
    ui_mobile_device_id,
    ohs_accommodation_type_ids,

    // we do not pass these 2 in the parseEmployeeFormData but still we add it here since the return value for
    // parseEmployeeFormData is EmployeeFormValues which supports these 2 fields
    // i.e. defensive programming
    ui_workspace_restricted_program_area_id,
    ui_mobile_device_title,

    ...employeeDbFields
  } = employee;

  return db.employee.create({
    data: employeeDbFields,
  });
}

export async function addNewEmployeeWithAssignments(
  employee: EmployeeFormValues,
) {
  return prisma.$transaction(async (db) => {
    const createdEmployee = await addNewEmployee(db, employee);

    await syncEmployeeRelatedAssignments(db, createdEmployee.id, employee);

    return createdEmployee;
  });
}

async function updateEmployee(db: DbClient, employee: EmployeeFormValues) {
  if (employee.id === undefined) {
    throw new Error(
      "Didn't find the employee primary key id. Can't update employee",
    );
  }

  const existingEmployee = await db.employee.findUnique({
    where: {
      id: employee.id,
    },
    select: {
      employee_id: true,
      idir: true,
    },
  });

  if (!existingEmployee) {
    throw new Error(`Employee with id ${employee.id} not found`);
  }

  // employee_id and idir are immutable once set.
  // If currently missing in DB, they may be added later.
  const {
    id,
    employee_id,
    idir,
    // we extract the following to ignore them
    ui_branch_id,
    ui_workspace_number,
    ui_workstation_asset_tags,
    ui_mobile_device_id,
    ohs_accommodation_type_ids,

    // we do not pass these 2 in the parseEmployeeFormData but still we add it here since the return value for
    // parseEmployeeFormData is EmployeeFormValues which supports these 2 fields
    // i.e. defensive programming
    ui_workspace_restricted_program_area_id,
    ui_mobile_device_title,

    ...employeeDbFields
  } = employee;

  // we don't update employee_id and idir if existing employee already has them set
  const data = {
    ...employeeDbFields,
    ...(existingEmployee.employee_id ? {} : { employee_id }),
    ...(existingEmployee.idir ? {} : { idir }),
  };

  return db.employee.update({
    where: { id },
    data,
  });
}

export async function updateEmployeeWithAssignments(
  employee: EmployeeFormValues,
) {
  return prisma.$transaction(async (db) => {
    const updatedEmployee = await updateEmployee(db, employee);

    await syncEmployeeRelatedAssignments(db, updatedEmployee.id, employee);

    return updatedEmployee;
  });
}

async function syncEmployeeRelatedAssignments(
  db: DbClient,
  employeeId: number,
  employee: EmployeeFormValues,
) {
  await syncEmployeeWorkspace(
    db,
    employeeId,
    employee.office_number,
    employee.ui_workspace_number,
  );

  await syncEmployeeWorkstations(
    db,
    employeeId,
    employee.office_number,
    employee.ui_workstation_asset_tags ?? [],
  );

  await syncEmployeeMobileDevice(
    db,
    employeeId,
    employee.office_number,
    employee.ui_mobile_device_id,
  );

  await syncEmployeeOhsAccommodations(
    db,
    employeeId,
    employee.ohs_accommodation_type_ids,
  );
}

async function syncEmployeeWorkspace(
  db: DbClient,
  employeeId: number,
  officeNumber: string,
  workspaceNumber?: string,
) {
  // Clear any existing workspace currently assigned to this employee
  await db.workspace.updateMany({
    where: {
      employee_id: employeeId,
    },
    data: {
      employee_id: null,
    },
  });

  // Assign the requested workspace, if one was selected
  if (workspaceNumber) {
    await db.workspace.update({
      where: {
        office_number_workspace_number: {
          office_number: officeNumber,
          workspace_number: workspaceNumber,
        },
      },
      data: {
        employee_id: employeeId,
        is_on_hold: false,
      },
    });
  }
}

async function syncEmployeeWorkstations(
  db: DbClient,
  employeeId: number,
  employeeOfficeNumber: string,
  workstationAssetTags: string[],
) {
  // Clear all workstation assignments currently linked to this employee
  // Do not change office_number here. Once unassigned, a workstation keeps its last known office.
  await db.workstation.updateMany({
    where: {
      employee_id: employeeId,
    },
    data: {
      employee_id: null,
    },
  });

  // if user assigned no workstations, stop
  if (workstationAssetTags.length === 0) return;

  // Assign the selected workstations to this employee and move them to the employee's current office
  // find all workstation rows whose asset_tag is one of the selected asset tags, and set their employee_id to this employee.
  await db.workstation.updateMany({
    where: {
      asset_tag: {
        in: workstationAssetTags,
      },
    },
    data: {
      employee_id: employeeId,
      office_number: employeeOfficeNumber,
    },
  });
}

async function syncEmployeeMobileDevice(
  db: DbClient,
  employeeId: number,
  employeeOfficeNumber: string,
  mobileDeviceId?: number,
) {
  // Clear any mobile device assignment currently linked to this employee
  // Do not change office_number here. Once unassigned, a mobile device keeps its last known office.
  await db.mobileDevice.updateMany({
    where: {
      employee_id: employeeId,
    },
    data: {
      employee_id: null,
    },
  });

  // if user assigned no mobile device, stop
  if (mobileDeviceId === undefined) return;

  // Assign the selected mobile device to this employee and move it to the employee's current office
  await db.mobileDevice.update({
    where: {
      id: mobileDeviceId,
    },
    data: {
      employee_id: employeeId,
      office_number: employeeOfficeNumber,
    },
  });
}

/**
 * Replace all OHS accommodation join rows for the given employee with the currently selected accommodation type ids.
 * @param employeeId
 * @param ohsAccommodationTypeIds
 */
async function syncEmployeeOhsAccommodations(
  db: DbClient,
  employeeId: number,
  ohsAccommodationTypeIds: number[],
) {
  // This removes all existing OHS rows for that employee.
  await db.employeeOhsAccommodation.deleteMany({
    where: {
      employee_id: employeeId,
    },
  });

  // if user selected nothing, stop
  if (ohsAccommodationTypeIds.length === 0) return;

  // recreate selected rows
  await db.employeeOhsAccommodation.createMany({
    data: ohsAccommodationTypeIds.map((ohsAccommodationTypeId) => ({
      employee_id: employeeId,
      ohs_accommodation_type_id: ohsAccommodationTypeId,
    })),
  });
}

export async function deleteEmployee(id: number) {
  return prisma.employee.delete({
    where: { id },
  });
}
