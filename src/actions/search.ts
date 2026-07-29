"use server";

import {Entity} from "@/types";

import {searchEmployeesAction} from "@/actions/entities/employee/actions";
import {searchOfficesAction} from "@/actions/entities/offices";
import {searchWorkspacesAction} from "@/actions/entities/workspaces";
import {searchWorkstationsAction} from "@/actions/entities/workstation/actions";
import {searchMobileDevicesAction} from "@/actions/entities/mobile-device/actions";
import {searchMobilePlansAction} from "@/actions/entities/mobile-plan/actions";


export async function searchAllAction(query?: string): Promise<Entity[]> {
    const [
        employeeSearchResults,
        officeSearchResults,
        workspaceSearchResults,
        workstationSearchResults,
        mobileDeviceSearchResults,
        mobilePlanSearchResults,
    ] = await Promise.all([
        searchEmployeesAction(query),
        searchOfficesAction(query),
        searchWorkspacesAction(query),
        searchWorkstationsAction(query),
        searchMobileDevicesAction(query),
        searchMobilePlansAction(query)
    ])

    return [
        ...employeeSearchResults,
        ...officeSearchResults,
        ...workspaceSearchResults,
        ...workstationSearchResults,
        ...mobileDeviceSearchResults,
        ...mobilePlanSearchResults
    ];
}
