import {EmployeeFormValues, EmployeeSearchResult, LookupOption} from "@/types";
import {Accordion, Callout, Select, TextArea, TextField} from "@bcgov/design-system-react-components";
import {
    validateEmployeeIdField,
    validateEmployeeIdirField,
    validateEmployeeNameField,
    validateNotesField
} from "@/validators";


interface EmployeeSectionProps {
    employee: EmployeeFormValues | EmployeeSearchResult | undefined
    branches: LookupOption[]
    programAreas: LookupOption[]
    selectedBranchId: number | undefined
    setSelectedBranchId: (branchId: number | undefined) => void
    isEditMode: boolean
}

export function EmployeeSection({
    employee,
    branches,
    programAreas,
    selectedBranchId,
    setSelectedBranchId,
    isEditMode
}: EmployeeSectionProps) {
    return (
        <Accordion label="Employee Details" id="employeeDetails">

            <div>

                <div style={{
                    marginBottom: "1rem",
                }}>
                    <Callout
                        description={`If Employee ID or IDIR is unknown, leave those fields blank`}>
                    </Callout>
                </div>

                <TextField label="First Name"
                           name="firstName"
                           isRequired
                           validate={value => validateEmployeeNameField(value, "First Name")}
                           defaultValue={employee?.first_name}>
                </TextField>

                <TextField label="Last Name"
                           name="lastName"
                           isRequired
                           validate={value => validateEmployeeNameField(value, "Last Name")}
                           defaultValue={employee?.last_name}>
                </TextField>

                <TextField label="Employee ID"
                           name="employeeId"
                           validate={validateEmployeeIdField}
                           isReadOnly={isEditMode && !!employee?.employee_id} // employee id can't be changed once it is set for an employee
                           defaultValue={employee?.employee_id ?? undefined}>
                </TextField>

                <TextField label="IDIR"
                           name="idir"
                           validate={validateEmployeeIdirField}
                           isReadOnly={isEditMode && !!employee?.idir} // idir can't be changed once it is set for an employee
                           defaultValue={employee?.idir ?? undefined}>
                </TextField>

                <TextField label="Alternate Name"
                           name="alternateName"
                           validate={value => validateEmployeeNameField(
                               value,
                               "Alternate Name",
                               {
                                   required: false,
                               }
                           )}
                           defaultValue={employee?.alternate_name ?? undefined}>
                </TextField>

                <Select
                    label="Branch"
                    name="branch"
                    isRequired
                    items={(branches ?? []).map(branch => (
                        {
                            id: branch.id,
                            label: branch.name,
                        }
                    ))}
                    selectedKey={selectedBranchId}
                    onSelectionChange={(key) =>
                        setSelectedBranchId(key == null ? undefined : Number(key))
                    }
                    placeholder="Select a Branch"
                >
                </Select>

                <Select
                    label="Program Area"
                    name="programArea"
                    isRequired
                    isDisabled={!selectedBranchId}
                    items={(programAreas ?? []).map(programArea => (
                        {
                            id: programArea.id,
                            label: programArea.name,
                        }
                    ))}
                    defaultSelectedKey={employee ? employee.program_area_id : undefined}
                    placeholder="Select a Program Area"
                >
                </Select>

                <TextArea label="Notes"
                          name="notes"
                          maxLength={2000}
                          validate={validateNotesField}
                          defaultValue={employee?.notes ?? undefined}>
                </TextArea>
            </div>

        </Accordion>
    )
}
