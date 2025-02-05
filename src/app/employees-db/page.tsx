import {getEmployees} from "@/prisma-db";

type Employee = {
    employee_id: string;
    first_name: string;
}

export default async function EmployeesDBPage() {
    const employees: Employee[] = await getEmployees();

    return (
        <ul>
            {employees.map((employee) => (
                <li key={employee.employee_id}>
                    <h2>{employee.employee_id}</h2>
                    <p>{employee.first_name}</p>
                </li>
            ))}
        </ul>
    );
}