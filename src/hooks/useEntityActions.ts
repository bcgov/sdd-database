import {useState} from "react";

import {Employee} from "@prisma/client";

import {Entity} from "@/types/Entity";

import {
    addNewEmployeeAction,
    deleteEmployeeAction,
    updateEmployeeAction
} from "@/actions/employees";
import {updateOfficeAction} from "@/actions/offices";
import {searchAction} from "@/actions/search"

import {getEmployeeFullName} from "@/utils";

interface Alert {
    variant: "success" | "danger";
    title?: string;
    description?: string;
}

export function useEntityActions() {
    const [searchPhrase, setSearchPhrase] = useState("");
    const [searchResults, setSearchResults] = useState<Entity[]>([]);
    const [selectedSearchResult, setSelectedSearchResult] = useState<Entity>();

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
        const results = await searchAction(query);   // create local variable to avoid setState timing issue
        setSearchResults(results);
    }

    const openSearchResultEditModal = (item: Entity) => {
        setSelectedSearchResult(item);
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

    const addSuccessAlert = (description: string, timeInMs: number = 4500) => {

        setAlert({
            variant: "success",
            title: "Success",
            description: description
        })

        // Auto-hide the success alert message after 4.5 seconds
        setTimeout(() => {
            setAlert(undefined);
        }, timeInMs)
    }

    const handleEditOffice = async (formData: FormData) => {

        if (selectedSearchResult?.type === "office") {
            const notes = formData.get("notes") as string || null;

            await updateOfficeAction(selectedSearchResult.office_number, notes);
        }
    }

    const handleEditEmployee = async (formData: FormData) => {

        if (selectedSearchResult?.type === "employee") {

            const updatedEmployee: Employee = {
                ...parseEmployeeFormData(formData),
                employee_id: selectedSearchResult.employee_id
            }

            await updateEmployeeAction(updatedEmployee);

            await runSearch(searchPhrase);  // This is because employees can be deleted
        }
    }

    const handleEdit = async (formData: FormData) => {

        let successAlertDescription = ""

        if (selectedSearchResult?.type === "employee") {
            handleEditEmployee(formData);
            successAlertDescription = "Employee details updated!"

        } else if (selectedSearchResult?.type === "office") {
            handleEditOffice(formData);
            successAlertDescription = "Office details updated!"
        }

        setIsSelectedSearchResultEditModalOpen(false);

        addSuccessAlert(successAlertDescription);
    }

    const handleDelete = async () => {

        if (selectedSearchResult?.type === "employee") {
            await deleteEmployeeAction(selectedSearchResult.employee_id);
            await runSearch(searchPhrase);

            setIsDeleteAlertDialogOpen(false);
            setIsSelectedSearchResultEditModalOpen(false);

            addSuccessAlert(`Employee '${getEmployeeFullName(selectedSearchResult)}' deleted!`)
        }
    }

    const handleAddNewEmployee = async (formData: FormData) => {

        const newEmployee: Employee = parseEmployeeFormData(formData);

        const result = await addNewEmployeeAction(newEmployee);

        setIsAddNewEmployeeModalOpen(false);

        if (result.success) {
            addSuccessAlert(`New employee '${getEmployeeFullName(newEmployee)}' added!`);
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
        selectedSearchResult,
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
        handleEdit,
        handleDelete,
        handleAddNewEmployee
    }
}
