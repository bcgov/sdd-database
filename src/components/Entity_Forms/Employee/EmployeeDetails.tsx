import {Accordion, Callout, Select, TextArea, TextField} from "@bcgov/design-system-react-components";
import {
    validateEmployeeIdField,
    validateEmployeeIdirField,
    validateEmployeeNameField,
    validateNotesField
} from "@/validators";
import {EmployeeLookupState} from "@/components/Entity_Forms/Employee/useEmployeeLookupState";
import {EmployeeLike} from "@/components/Entity_Forms/Employee/types";


interface EmployeeDetailsProps {
    employee: EmployeeLike
    lookupState: EmployeeLookupState
    isEditMode: boolean
}

export function EmployeeDetails({
                                    employee,
                                    lookupState,
                                    isEditMode
                                }: EmployeeDetailsProps) {

    const {
        branches,
        programAreas,
        jobTitles,
        selectedBranchId,
        handleBranchSelectionChange,
        selectedProgramAreaId,
        handleProgramAreaSelectionChange,
        selectedJobTitleId,
        setSelectedJobTitleId,
        isJobTitleRequired
    } = lookupState;

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

                <Select label="Branch"
                        name="branch"
                        isRequired
                        items={branches.map(branch => (
                            {
                                id: branch.id,
                                label: branch.name,
                            }
                        ))}
                        selectedKey={selectedBranchId}
                        onSelectionChange={(key) =>
                            handleBranchSelectionChange(key == null ? null : Number(key))
                        }
                        placeholder="Select a Branch"
                >
                </Select>

                <Select label="Program Area"
                        name="programArea"
                        isRequired
                        isDisabled={!selectedBranchId}
                        items={programAreas.map(programArea => (
                            {
                                id: programArea.id,
                                label: programArea.name,
                            }
                        ))}
                        selectedKey={selectedProgramAreaId}
                        onSelectionChange={(key) =>
                            handleProgramAreaSelectionChange(key == null ? null : Number(key))}
                        placeholder="Select a Program Area"
                >
                </Select>

                <Select label="Job Title"
                        name="jobTitle"
                        isRequired={isJobTitleRequired}
                        isDisabled={!selectedProgramAreaId || jobTitles.length === 0}
                        items={jobTitles.map(jobTitle => (
                            {
                                id: jobTitle.id,
                                label: jobTitle.name,
                            }
                        ))}
                        selectedKey={selectedJobTitleId}
                        onSelectionChange={(key) =>
                            setSelectedJobTitleId(key == null ? null : Number(key))}
                        placeholder="Select a Job Title">
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
