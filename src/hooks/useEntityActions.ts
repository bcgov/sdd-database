import {useState} from "react";
import type {Selection} from "@react-types/shared"

import {Employee} from "@prisma/client";

import {Entity} from "@/types/Entity";

import {
    addNewEmployeeAction,
    deleteEmployeeAction,
    updateEmployeeAction
} from "@/actions/employees";
import {searchOfficesAction, updateOfficeAction} from "@/actions/offices";
import {searchAllAction} from "@/actions/search"

import {getEmployeeFullName} from "@/utils";


interface Alert {
    variant: "success" | "danger";
    title?: string;
    description?: string;
}

export function useEntityActions() {
    const [searchPhrase, setSearchPhrase] = useState<string>();

    const [selectedFilterTags, setSelectedFilterTags] = useState<Selection>(new Set<string>());

    const [searchResults, setSearchResults] = useState<Entity[]>([]);
    const [selectedSearchResult, setSelectedSearchResult] = useState<Entity>();

    const [isSelectedSearchResultEditModalOpen, setIsSelectedSearchResultEditModalOpen] = useState(false);
    const [isDeleteAlertDialogOpen, setIsDeleteAlertDialogOpen] = useState(false);
    const [isAddNewEmployeeModalOpen, setIsAddNewEmployeeModalOpen] = useState(false);

    const [assignMode, setAssignMode] = useState(false);
    const [draftEmployee, setDraftEmployee] = useState<Employee>();

    const [alert, setAlert] = useState<Alert>();

    const userHasSearchedOnce = () => searchPhrase !== undefined;

    const handleSearch = async (formData: FormData) => {
        const query = formData.get("search") as string;
        setSearchPhrase(query);

        await runSearch(query);
    }

    const refreshSearchResults = () => {
        runSearch(searchPhrase)
    }

    const runSearch = async (query?: string, searchOnlyOffices?: boolean) => {

        let results: Entity[] = [];

        if (searchOnlyOffices || assignMode) {
            results = await searchOfficesAction(query);
        } else {
            results = await searchAllAction(query);
        }

        setSearchResults(results);
    }

    const openSearchResultEditModal = (item: Entity) => {
        setSelectedSearchResult(item);
        setIsSelectedSearchResultEditModalOpen(true);
    }

    const activateAssignMode = async (formData: FormData) => {

        setDraftEmployee(parseEmployeeFormData(formData));

        setAssignMode(true);

        // get all offices
        // passing state as a parameter since setStates are async
        await runSearch(undefined, true)

        setSelectedFilterTags(new Set(["office"]))

        setIsAddNewEmployeeModalOpen(false)
    }

    const assignOfficeClickHandler = (assignedOfficeNumber: string) => {

        if (draftEmployee) {
            setDraftEmployee({
                ...draftEmployee,
                office_number: assignedOfficeNumber
            });
        }

        setAssignMode(false)
        setIsAddNewEmployeeModalOpen(true)
    }

    const parseEmployeeFormData = (formData: FormData): Employee => {
        return {
            first_name: formData.get("firstName") as string,
            middle_name: formData.get("middleName") as string,
            last_name: formData.get("lastName") as string,
            employee_id: formData.get("employeeId") as string,
            office_number: formData.get("officeNumber") as string,
            notes: formData.get("notes") as string,
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

            await updateEmployeeAction(updatedEmployee)

            // We update previous search results just in case anything in the search result card title changes for
            // this specific item
            refreshSearchResults()
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

            // We update previous search results in case an employee is deleted
            refreshSearchResults()

            setIsDeleteAlertDialogOpen(false)
            setIsSelectedSearchResultEditModalOpen(false)

            addSuccessAlert(`Employee '${getEmployeeFullName(selectedSearchResult)}' deleted!`)
        }
    }

    const handleAddNewEmployee = async (formData: FormData) => {

        const newEmployee: Employee = parseEmployeeFormData(formData)

        const result = await addNewEmployeeAction(newEmployee)

        refreshSearchResults()

        setIsAddNewEmployeeModalOpen(false)

        setDraftEmployee(undefined)

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
        searchResults,
        selectedFilterTags,
        setSelectedFilterTags,
        assignMode,
        draftEmployee,
        selectedSearchResult,
        alert,
        setAlert,
        isSelectedSearchResultEditModalOpen,
        setIsSelectedSearchResultEditModalOpen,
        isDeleteAlertDialogOpen,
        setIsDeleteAlertDialogOpen,
        isAddNewEmployeeModalOpen,
        setIsAddNewEmployeeModalOpen,
        openSearchResultEditModal,
        userHasSearchedOnce,
        handleSearch,
        handleEdit,
        handleDelete,
        handleAddNewEmployee,
        activateAssignMode,
        assignOfficeClickHandler
    }
}
