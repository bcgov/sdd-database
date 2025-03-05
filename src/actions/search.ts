import {Entity} from "@/types/Entity";
import {searchEmployeesAction} from "@/actions/employees";
import {searchOfficesAction} from "@/actions/offices";

export async function searchAction(query: string): Promise<Entity[]> {
    const [employeeSearchResults, officeSearchResults] = await Promise.all([
        searchEmployeesAction(query),
        searchOfficesAction(query),
    ])

    // Attaching the discriminant 'type'
    const employeesWithType: Entity[] = employeeSearchResults.map(employee => ({
        ...employee,
        type: "employee" as const,
    }))

    const officesWithType: Entity[] = officeSearchResults.map(office => ({
        ...office,
        type: "office" as const,
    }))

    return [...employeesWithType, ...officesWithType];
}
