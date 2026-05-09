import {Prisma} from "@/generated/prisma/client"
import {EmployeeFormValues} from "@/types";
import {
    appendPrismaErrorCodeIfNeeded,
    BASE_PRISMA_ERROR_MESSAGE,
    getPrismaForeignKeyName, getPrismaUniqueFieldName
} from "@/actions/prismaErrorHelpers";


export function getReadablePrismaError(error: unknown, employee?: EmployeeFormValues) {

    const base = BASE_PRISMA_ERROR_MESSAGE

    let errorMessage = base

    if (error instanceof Prisma.PrismaClientKnownRequestError) {

        const {code, meta} = error;

        console.log(`code :'${code}', message: '${error.message}'`);

        switch (code) {

            case "P2000": {

                errorMessage = `One of the fields is longer than the max limit. Please shorten it and try again. Note: Employee ID must be exactly 6 digits long, IDIR can be upto 8 characters long, the Names (First Name, Last Name, Alternate Name) can be up to 30 characters long and Notes can be up to 200 characters long.`;

                break;
            }
            case "P2002": {

                const errorFieldName = getPrismaUniqueFieldName(meta)
                const modelName = meta?.modelName

                if (modelName === "MobileDevice" && errorFieldName === "employee_id") {
                    errorMessage = `This employee is already assigned to another mobile device. Please refresh the page and try again.`
                } else if (modelName === "Workspace" && errorFieldName === "employee_Id") {
                    errorMessage = `This employee is already assigned to another workspace. Please refresh the page and try again.`
                } else if (errorFieldName === "employee_id" && employee?.employee_id) {
                    errorMessage = `Employee ID '${employee.employee_id}' is already in use for some other employee`
                } else if (errorFieldName === "idir" && employee?.idir) {
                    errorMessage = `IDIR '${employee.idir}' is already in use for some other employee`
                } else {
                    // fallback if we can't determine the exact field
                    errorMessage = `An employee already exists with the same unique value. Please verify Employee ID and IDIR and try again.`;
                }

                break
            }
            case "P2003": {

                const foreignKey = getPrismaForeignKeyName(meta)

                switch (foreignKey) {
                    case "Employee_office_number_fkey":
                        errorMessage = `It seems like an office wasn't assigned for this new employee. Please assign an office and try again.`
                        break

                    case "Employee_program_area_id_fkey":
                        errorMessage = `It seems like a program area wasn't selected for this new employee. Please select a program area and try again.`
                        break

                    case "Employee_job_title_id_fkey":
                        errorMessage = `It seems like a job title wasn't selected for this new employee. Please select a job title and try again.`
                        break
                }
                break
            }
            case "P2025": {
                const modelName = meta?.modelName ?? "record";

                errorMessage = `You are trying to edit a ${modelName} that no longer exists. Please refresh the page to get the latest list of ${modelName}s.`;

                break
            }
            default: {
                errorMessage += ` Error code: "${code}"`;
            }
        }
        // If we didn’t set a specific message in the matched case, append the code as a safety net.
        errorMessage = appendPrismaErrorCodeIfNeeded(errorMessage, base, code)
    }

    console.error(error);

    return errorMessage;
}
