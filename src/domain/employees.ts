export const getEmployeeFullName = (
    employee: {
        first_name: string
        alternate_name?: string | null
        last_name: string
    } | undefined
) => {

    let fullName = "";

    if (employee) {

        fullName = employee.alternate_name
            ? `${employee.first_name} (${employee.alternate_name}) ${employee.last_name}`
            : `${employee.first_name} ${employee.last_name}`
    }

    return fullName;
}
