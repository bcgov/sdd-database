import type { Prisma } from "@/generated/prisma/client";

/**
 * A workstation is ready for redeployment when it is not assigned to an
 * employee.
 */
export function buildWorkstationRedeployFilter(): Prisma.WorkstationWhereInput {
  return {
    employee_id: null,
  };
}

/**
 * A mobile device is ready for redeployment only when it is not assigned to
 * an employee and it has not been disposed of or reported lost/stolen.
 */
export function buildMobileDeviceRedeployFilter(): Prisma.MobileDeviceWhereInput {
  return {
    employee_id: null,
    adr: null,
    gilr: null,
  };
}
