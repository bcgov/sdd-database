import {MobilePlanSearchResult} from "@/types";
import {Prisma} from "@/generated/prisma/client";
import {mobilePlanSearchResultArgs} from "@/db/data-access/searchResultArgs";
import {prisma} from "@/db/client";
import {normalizeMobilePlanPhoneNumber} from "@/domain/mobilePlans";


export async function getMobilePlansByFilter(query?: string): Promise<MobilePlanSearchResult[]> {
    // Phone numbers are stored as 10 digits but users may search using the displayed ###-###-#### format.
    const normalizedQuery = query ? normalizeMobilePlanPhoneNumber(query) : undefined

    const searchFilter: Prisma.MobilePlanWhereInput = normalizedQuery
        ? {
            phone_number: {
                equals: normalizedQuery
            }
        }
        : {}

    return prisma.mobilePlan.findMany({
        where: searchFilter,
        ...mobilePlanSearchResultArgs,
        orderBy: {
            phone_number: "asc"
        }
    })
}
