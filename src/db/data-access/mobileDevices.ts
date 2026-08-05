import {
  MobileDeviceAdvancedSearchRequest,
  MobileDeviceFormValues,
  MobileDeviceSearchResult,
} from "@/types";
import { prisma } from "@/db/client";
import { Prisma } from "@/generated/prisma/client";
import { mobileDeviceSearchResultArgs } from "@/db/data-access/searchResultArgs";
import {
  DEFAULT_MOBILE_PLAN_STATUS,
  MobilePlanAssignmentError,
} from "@/domain/mobilePlans";
import {
  buildMobileDeviceAdvancedSearchFilter,
  buildMobileDeviceKeywordSearchFilter,
} from "@/db/data-access/mobileDeviceSearchFilters";
import { hasAdvancedSearchCriteria } from "@/domain/advancedSearch";

type DbClient = Prisma.TransactionClient;

export async function getMobileDeviceById(id: number) {
  return prisma.mobileDevice.findUnique({
    where: {
      id,
    },
  });
}

const mobileDeviceOrderBy: Prisma.MobileDeviceOrderByWithRelationInput[] = [
  {
    mobile_device_model: {
      name: "asc",
    },
  },
  {
    imei: "asc",
  },
];

export async function getMobileDevicesByFilter(
  query?: string,
): Promise<MobileDeviceSearchResult[]> {
  const searchFilter: Prisma.MobileDeviceWhereInput = query
    ? buildMobileDeviceKeywordSearchFilter(query)
    : {};

  return prisma.mobileDevice.findMany({
    where: searchFilter,
    ...mobileDeviceSearchResultArgs,
    orderBy: mobileDeviceOrderBy,
  });
}

export async function getMobileDevicesByAdvancedFilter(
  request: MobileDeviceAdvancedSearchRequest,
): Promise<MobileDeviceSearchResult[]> {
  if (!hasAdvancedSearchCriteria(request.query, request.filters)) {
    return [];
  }

  return prisma.mobileDevice.findMany({
    where: buildMobileDeviceAdvancedSearchFilter(request),
    ...mobileDeviceSearchResultArgs,
    orderBy: mobileDeviceOrderBy,
  });
}

export async function getAssignableMobileDevicesByFilter(
  query?: string,
): Promise<MobileDeviceSearchResult[]> {
  const searchFilter: Prisma.MobileDeviceWhereInput = query
    ? {
        OR: [
          { imei: { contains: query } },
          {
            mobile_device_model: {
              name: { contains: query, mode: "insensitive" },
            },
          },
          { office_number: { contains: query } },
        ],
      }
    : {};

  return prisma.mobileDevice.findMany({
    where: {
      adr: null,
      gilr: null,
      employee_id: null,
      ...searchFilter,
    },
    ...mobileDeviceSearchResultArgs,
    orderBy: mobileDeviceOrderBy,
  });
}

async function addNewMobileDevice(
  db: DbClient,
  mobileDevice: MobileDeviceFormValues,
) {
  const {
    id,
    ui_mobile_device_status,
    ui_mobile_plan_id,
    ui_mobile_plan_title,
    ...mobileDeviceDbFields
  } = mobileDevice;

  return db.mobileDevice.create({
    data: mobileDeviceDbFields,
  });
}

export async function addNewMobileDeviceWithPlanAssignment(
  mobileDevice: MobileDeviceFormValues,
) {
  return prisma.$transaction(async (db) => {
    const createdMobileDevice = await addNewMobileDevice(db, mobileDevice);

    await syncMobileDevicePlan(
      db,
      createdMobileDevice.id,
      mobileDevice.ui_mobile_plan_id,
    );

    return createdMobileDevice;
  });
}

async function updateMobileDevice(
  db: DbClient,
  mobileDevice: MobileDeviceFormValues,
) {
  if (mobileDevice.id === undefined) {
    throw new Error(
      "Didn't find the mobile device primary key id. Can't update mobile device",
    );
  }

  const existingMobileDevice = await db.mobileDevice.findUnique({
    where: {
      id: mobileDevice.id,
    },
    select: {
      employee_id: true,
    },
  });

  if (!existingMobileDevice) {
    throw new Error(`Mobile Device with id ${mobileDevice.id} not found`);
  }

  return db.mobileDevice.update({
    where: {
      id: mobileDevice.id,
    },
    data: {
      adr: mobileDevice.adr,
      gilr: mobileDevice.gilr,
      notes: mobileDevice.notes,

      // Office number is manually editable only while the mobile device is unassigned
      ...(existingMobileDevice.employee_id === null
        ? { office_number: mobileDevice.office_number }
        : {}),
    },
  });
}

export async function updateMobileDeviceWithPlanAssignment(
  mobileDevice: MobileDeviceFormValues,
) {
  return prisma.$transaction(async (db) => {
    const updatedMobileDevice = await updateMobileDevice(db, mobileDevice);

    await syncMobileDevicePlan(
      db,
      updatedMobileDevice.id,
      mobileDevice.ui_mobile_plan_id,
    );

    return updatedMobileDevice;
  });
}

/**
 * Replace the mobile plan linked to one device without changing any plan's
 * status. A suspended or cancelled plan may remain linked, but a new selection
 * must be an active, unassigned plan at the moment Save/Create is clicked.
 */
async function syncMobileDevicePlan(
  db: DbClient,
  mobileDeviceId: number,
  selectedMobilePlanId: number | null,
) {
  const currentlyAssignedPlan = await db.mobilePlan.findUnique({
    where: {
      mobile_device_id: mobileDeviceId,
    },
    select: {
      id: true,
    },
  });

  // Preserve an existing relation regardless of its current plan status.
  // This is important for the historical Suspended/Cancelled records that
  // should remain associated until a user explicitly removes them.
  if (currentlyAssignedPlan?.id === selectedMobilePlanId) return;

  if (currentlyAssignedPlan) {
    await db.mobilePlan.update({
      where: {
        id: currentlyAssignedPlan.id,
      },
      data: {
        mobile_device_id: null,
      },
    });
  }

  if (selectedMobilePlanId === null) return;

  // updateMany makes the final eligibility check atomic: if another user
  // assigned or changed the plan after it appeared in search, no row changes
  // and the enclosing transaction rolls back the earlier unlink.
  const assignment = await db.mobilePlan.updateMany({
    where: {
      id: selectedMobilePlanId,
      mobile_device_id: null,
      status: {
        name: DEFAULT_MOBILE_PLAN_STATUS,
      },
    },
    data: {
      mobile_device_id: mobileDeviceId,
    },
  });

  if (assignment.count !== 1) {
    throw new MobilePlanAssignmentError(
      "This mobile plan is no longer available. Please choose another active, unassigned plan.",
    );
  }
}
