import {useState} from "react";

import {Employee} from "@prisma/client";

import {
    addNewEmployeeAction,
    deleteEmployeeAction,
    searchEmployeesAction,
    updateEmployeeAction
} from "@/actions/employees";
import {getEmployeeFullName} from "@/utils";

interface Alert {
    variant: "success" | "danger";
    title?: string;
    description?: string;
}

export function useEmployeeActions() {
    const [searchPhrase, setSearchPhrase] = useState("");
    const [searchResults, setSearchResults] = useState<Employee[]>([]);
    const [selectedEmployeeSearchResult, setSelectedEmployeeSearchResult] = useState<Employee>();

    const [isSelectedSearchResultEditModalOpen, setIsSelectedSearchResultEditModalOpen] = useState(false);
    const [isDeleteAlertDialogOpen, setIsDeleteAlertDialogOpen] = useState(false);
    const [isAddNewEmployeeModalOpen, setIsAddNewEmployeeModalOpen] = useState(false);

    const [alert, setAlert] = useState<Alert>();

    const handleSearch = async (formData: FormData) => {
        const query = formData.get("search") as string;
        setSearchPhrase(query);
        await runSearch(query);
    }

    const runSearch = async (query: string) => {
        const results = await searchEmployeesAction(query);   // create local variable to avoid setState timing issue
        setSearchResults(results);
    }

    const openSearchResultEditModal = (employee: Employee) => {
        setSelectedEmployeeSearchResult(employee);
        setIsSelectedSearchResultEditModalOpen(true);
    }

    const parseEmployeeFormData = (formData: FormData) => {

        return {
            first_name: formData.get("firstName") as string,
            // converting empty middle name to null for clarity in database
            middle_name: formData.get("middleName") as string || null,
            last_name: formData.get("lastName") as string,
            employee_id: formData.get("employeeId") as string,
            notes: formData.get("notes") as string || null,
        }
    }

    const handleEditEmployee = async (formData: FormData) => {
        if (selectedEmployeeSearchResult) {

            const updatedEmployee: Employee = {
                ...parseEmployeeFormData(formData),
                employee_id: selectedEmployeeSearchResult.employee_id
            }

            await updateEmployeeAction(updatedEmployee);

            await runSearch(searchPhrase);
            setIsSelectedSearchResultEditModalOpen(false);

            setAlert({
                variant: "success",
                title: "Success",
                description: `Employee details updated for '${getEmployeeFullName(selectedEmployeeSearchResult)}'!`
            })

            // Auto-hide the success alert message after 4.5 seconds
            setTimeout(() => {
                setAlert(undefined);
            }, 4500)
        }
    }

    const handleDelete = async () => {

        if (selectedEmployeeSearchResult) {
            await deleteEmployeeAction(selectedEmployeeSearchResult.employee_id);
            await runSearch(searchPhrase);
            setIsDeleteAlertDialogOpen(false);
            setIsSelectedSearchResultEditModalOpen(false);

            setAlert({
                variant: "success",
                title: "Success",
                description: `Employee '${getEmployeeFullName(selectedEmployeeSearchResult)}' deleted!`
            })

            setTimeout(() => {
                setAlert(undefined);
            }, 4500)
        }
    }

    const handleAddNewEmployee = async (formData: FormData) => {

        const newEmployee: Employee = parseEmployeeFormData(formData);

        const result = await addNewEmployeeAction(newEmployee);

        setIsAddNewEmployeeModalOpen(false);

        if (result.success) {

            setAlert({
                variant: "success",
                title: "Success",
                description: `New employee '${getEmployeeFullName(newEmployee)}' added!`
            })

            // Auto-hide the success alert message after 4.5 seconds
            setTimeout(() => {
                setAlert(undefined);
            }, 4500)
        } else {
            setAlert({
                variant: "danger",
                title: `Error: Could not add new employee '${getEmployeeFullName(newEmployee)}'`,
                description: result.error ?? "An unexpected error occurred."
            })
        }
    }

    return {
        searchPhrase,
        searchResults,
        selectedEmployeeSearchResult,
        isSelectedSearchResultEditModalOpen,
        setIsSelectedSearchResultEditModalOpen,
        isDeleteAlertDialogOpen,
        setIsDeleteAlertDialogOpen,
        isAddNewEmployeeModalOpen,
        setIsAddNewEmployeeModalOpen,
        alert,
        setAlert,
        handleSearch,
        openSearchResultEditModal,
        handleEditEmployee,
        handleDelete,
        handleAddNewEmployee
    }
}