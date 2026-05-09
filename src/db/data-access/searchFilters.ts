export function buildAssignedEmployeeSearchFilter(query: string) {
    return {
        assigned_employee: {
            is: {
                OR: [
                    {idir: {contains: query, mode: 'insensitive' as const}},
                    {first_name: {contains: query, mode: 'insensitive' as const}},
                    {alternate_name: {contains: query, mode: 'insensitive' as const}},
                    {last_name: {contains: query, mode: 'insensitive' as const}},
                ]
            }
        }
    }
}
