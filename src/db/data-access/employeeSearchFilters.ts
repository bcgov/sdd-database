import type { Prisma } from "@/generated/prisma/client";
import type { EmployeeAdvancedSearchRequest } from "@/types";
import { hasEmployeeAdvancedSearchCriteria } from "@/domain/advancedSearch";
import { parseKeywordSearchQuery } from "@/db/data-access/searchFilters";

function getTextFilterValue(value?: string) {
  return value?.trim() || undefined;
}

export function buildEmployeeKeywordSearchFilter(
  query: string,
): Prisma.EmployeeWhereInput {
  const searchQuery = parseKeywordSearchQuery(query);

  if (!searchQuery) return {};

  const { value, isDigitsOnly } = searchQuery;
  const descriptiveFilters: Prisma.EmployeeWhereInput[] = isDigitsOnly
    ? []
    : [
        { first_name: { contains: value, mode: "insensitive" } },
        { alternate_name: { contains: value, mode: "insensitive" } },
        { last_name: { contains: value, mode: "insensitive" } },
        {
          program_area: {
            branch: { name: { contains: value, mode: "insensitive" } },
          },
        },
        {
          program_area: {
            name: { contains: value, mode: "insensitive" },
          },
        },
        { job_title: { name: { contains: value, mode: "insensitive" } } },
        { notes: { contains: value, mode: "insensitive" } },
        {
          workspace_assignment_type: {
            name: { contains: value, mode: "insensitive" },
          },
        },
        {
          ohs_accommodations: {
            some: {
              ohs_accommodation_type: {
                name: { contains: value, mode: "insensitive" },
              },
            },
          },
        },
      ];

  return {
    OR: [
      { office_number: { equals: value, mode: "insensitive" } },
      { idir: { equals: value, mode: "insensitive" } },
      { employee_id: { equals: value, mode: "insensitive" } },
      ...descriptiveFilters,
    ],
  };
}

export function buildEmployeeAdvancedSearchFilter(
  request: EmployeeAdvancedSearchRequest,
): Prisma.EmployeeWhereInput {
  const conditions: Prisma.EmployeeWhereInput[] = [];
  const { filters } = request;
  const query = getTextFilterValue(request.query);

  if (query) {
    conditions.push(buildEmployeeKeywordSearchFilter(query));
  }

  const firstName = getTextFilterValue(filters.firstName);
  if (firstName) {
    conditions.push({
      first_name: { contains: firstName, mode: "insensitive" },
    });
  }

  const alternateName = getTextFilterValue(filters.alternateName);
  if (alternateName) {
    conditions.push({
      alternate_name: { contains: alternateName, mode: "insensitive" },
    });
  }

  const lastName = getTextFilterValue(filters.lastName);
  if (lastName) {
    conditions.push({
      last_name: { contains: lastName, mode: "insensitive" },
    });
  }

  const idir = getTextFilterValue(filters.idir);
  if (idir) {
    conditions.push({ idir: { equals: idir, mode: "insensitive" } });
  }

  const employeeId = getTextFilterValue(filters.employeeId);
  if (employeeId) {
    conditions.push({
      employee_id: { equals: employeeId, mode: "insensitive" },
    });
  }

  const officeNumber = getTextFilterValue(filters.officeNumber);
  if (officeNumber) {
    conditions.push({
      office_number: { equals: officeNumber, mode: "insensitive" },
    });
  }

  const notes = getTextFilterValue(filters.notes);
  if (notes) {
    conditions.push({ notes: { contains: notes, mode: "insensitive" } });
  }

  if (filters.branchId !== undefined) {
    conditions.push({ program_area: { branch_id: filters.branchId } });
  }

  if (filters.programAreaId !== undefined) {
    conditions.push({ program_area_id: filters.programAreaId });
  }

  if (filters.jobTitleId !== undefined) {
    conditions.push({ job_title_id: filters.jobTitleId });
  }

  if (filters.isOnLeave !== undefined) {
    conditions.push({ is_on_leave: filters.isOnLeave });
  }

  if (filters.workspaceAssignmentTypeId !== undefined) {
    conditions.push({
      workspace_assignment_type_id: filters.workspaceAssignmentTypeId,
    });
  }

  if (filters.ohsAccommodationTypeIds?.length) {
    conditions.push({
      ohs_accommodations: {
        some: {
          ohs_accommodation_type_id: {
            in: filters.ohsAccommodationTypeIds,
          },
        },
      },
    });
  }

  const workspaceNumber = getTextFilterValue(filters.workspaceNumber);
  if (workspaceNumber) {
    conditions.push({
      workspace: {
        is: {
          workspace_number: {
            equals: workspaceNumber,
            mode: "insensitive",
          },
        },
      },
    });
  }

  const workstationAssetTag = getTextFilterValue(filters.workstationAssetTag);
  if (workstationAssetTag) {
    conditions.push({
      workstations: {
        some: {
          asset_tag: {
            equals: workstationAssetTag,
            mode: "insensitive",
          },
        },
      },
    });
  }

  const mobileDeviceImei = getTextFilterValue(filters.mobileDeviceImei);
  if (mobileDeviceImei) {
    conditions.push({
      mobile_device: {
        is: {
          imei: {
            equals: mobileDeviceImei,
            mode: "insensitive",
          },
        },
      },
    });
  }

  return conditions.length > 0 ? { AND: conditions } : {};
}
