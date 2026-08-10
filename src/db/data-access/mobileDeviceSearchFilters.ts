import type { Prisma } from "@/generated/prisma/client";
import { parseDate } from "@internationalized/date";
import type { MobileDeviceAdvancedSearchRequest } from "@/types";
import {
  buildAssignedEmployeeSearchFilter,
  parseKeywordSearchQuery,
} from "@/db/data-access/searchFilters";
import { normalizeMobilePlanPhoneNumber } from "@/domain/mobilePlans";
import { buildMobileDeviceRedeployFilter } from "@/db/data-access/redeployFilters";

function getTextFilterValue(value?: string) {
  return value?.trim() || undefined;
}

function getDateFilterValue(value?: string) {
  if (!value) return undefined;

  const date = new Date(`${value}T00:00:00.000Z`);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

function getOrderDateForPaymentEndDate(value?: string) {
  if (!value) return undefined;

  try {
    return getDateFilterValue(
      parseDate(value).subtract({ months: 36 }).toString(),
    );
  } catch {
    return undefined;
  }
}

export function buildMobileDeviceKeywordSearchFilter(
  query: string,
): Prisma.MobileDeviceWhereInput {
  const searchQuery = parseKeywordSearchQuery(query);

  if (!searchQuery) return {};

  const { value, isDigitsOnly } = searchQuery;

  return {
    OR: [
      { imei: { equals: value, mode: "insensitive" } },
      { adr: { equals: value, mode: "insensitive" } },
      { gilr: { equals: value, mode: "insensitive" } },
      { office_number: { equals: value, mode: "insensitive" } },
      {
        mobile_plan: {
          phone_number: { equals: normalizeMobilePlanPhoneNumber(value) },
        },
      },
      buildAssignedEmployeeSearchFilter(searchQuery),
      ...(!isDigitsOnly
        ? [
            {
              mobile_device_model: {
                name: { contains: value, mode: "insensitive" as const },
              },
            },
          ]
        : []),
    ],
  };
}

export function buildAssignableMobileDeviceKeywordSearchFilter(
  query: string,
): Prisma.MobileDeviceWhereInput {
  const searchQuery = parseKeywordSearchQuery(query);

  if (!searchQuery) return {};

  const { value, isDigitsOnly } = searchQuery;

  return {
    OR: [
      { imei: { equals: value, mode: "insensitive" } },
      { office_number: { equals: value, mode: "insensitive" } },
      {
        mobile_plan: {
          phone_number: { equals: normalizeMobilePlanPhoneNumber(value) },
        },
      },
      ...(!isDigitsOnly
        ? [
            {
              mobile_device_model: {
                name: { contains: value, mode: "insensitive" as const },
              },
            },
          ]
        : []),
    ],
  };
}

export function buildMobileDeviceAdvancedSearchFilter(
  request: MobileDeviceAdvancedSearchRequest,
): Prisma.MobileDeviceWhereInput {
  const conditions: Prisma.MobileDeviceWhereInput[] = [];
  const { filters } = request;
  const query = getTextFilterValue(request.query);

  if (query) {
    conditions.push(buildMobileDeviceKeywordSearchFilter(query));
  }

  const imei = getTextFilterValue(filters.imei);
  if (imei) {
    conditions.push({ imei: { equals: imei, mode: "insensitive" } });
  }

  const orderDate = getDateFilterValue(filters.orderDate);
  if (orderDate) {
    conditions.push({ order_date: { equals: orderDate } });
  }

  const paymentEndDate = getOrderDateForPaymentEndDate(filters.paymentEndDate);
  if (paymentEndDate) {
    conditions.push({ order_date: { equals: paymentEndDate } });
  }

  const adr = getTextFilterValue(filters.adr);
  if (adr) {
    conditions.push({ adr: { equals: adr, mode: "insensitive" } });
  }

  const gilr = getTextFilterValue(filters.gilr);
  if (gilr) {
    conditions.push({ gilr: { equals: gilr, mode: "insensitive" } });
  }

  const notes = getTextFilterValue(filters.notes);
  if (notes) {
    conditions.push({ notes: { contains: notes, mode: "insensitive" } });
  }

  if (filters.modelId !== undefined) {
    conditions.push({ model_id: filters.modelId });
  }

  const officeNumber = getTextFilterValue(filters.officeNumber);
  if (officeNumber) {
    conditions.push({
      office_number: { equals: officeNumber, mode: "insensitive" },
    });
  }

  switch (filters.status) {
    case "unassigned":
      conditions.push(buildMobileDeviceRedeployFilter());
      break;
    case "assigned":
      conditions.push({
        adr: null,
        gilr: null,
        employee_id: { not: null },
      });
      break;
    case "adr":
      conditions.push({ adr: { not: null } });
      break;
    case "gilr":
      conditions.push({ adr: null, gilr: { not: null } });
      break;
  }

  if (filters.isAssigned !== undefined) {
    // Unlike the Redeploy device status, this intentionally checks only the
    // employee relation and can therefore include Disposed or Lost / Stolen
    // devices.
    conditions.push({
      employee_id: filters.isAssigned ? { not: null } : null,
    });
  }

  const assignedEmployeeIdir = getTextFilterValue(filters.assignedEmployeeIdir);
  if (assignedEmployeeIdir) {
    conditions.push({
      assigned_employee: {
        is: {
          idir: { equals: assignedEmployeeIdir, mode: "insensitive" },
        },
      },
    });
  }

  if (filters.hasMobilePlan !== undefined) {
    conditions.push({
      mobile_plan: filters.hasMobilePlan ? { isNot: null } : { is: null },
    });
  }

  const mobilePlanPhoneNumber = getTextFilterValue(
    filters.mobilePlanPhoneNumber,
  );
  if (mobilePlanPhoneNumber) {
    conditions.push({
      mobile_plan: {
        is: {
          phone_number: {
            equals: normalizeMobilePlanPhoneNumber(mobilePlanPhoneNumber),
          },
        },
      },
    });
  }

  return conditions.length > 0 ? { AND: conditions } : {};
}
