import {useState} from "react";
import type {Selection} from "@react-types/shared"

import {Employee, Workstation} from "@prisma/client";

import {Entity} from "@/types/Entity";

import {
    addNewEmployeeAction,
    deleteEmployeeAction,
    updateEmployeeAction
} from "@/actions/employees";
import {searchOfficesAction, updateOfficeAction} from "@/actions/offices";
import {addNewWorkstationAction, updateWorkstationAction} from "@/actions/workstations";
import {searchAllAction} from "@/actions/search"

import {ENTITY_TYPE_NAME, getEmployeeFullName} from "@/utils";


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

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteAlertDialogOpen, setIsDeleteAlertDialogOpen] = useState(false);
    const [isAddNewEmployeeModalOpen, setIsAddNewEmployeeModalOpen] = useState(false);
    const [isAddNewWorkstationModalOpen, setIsAddNewWorkstationModalOpen] = useState(false);

    const [assignMode, setAssignMode] = useState(false);
    const [draftNewEmployee, setDraftNewEmployee] = useState<Employee>();

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
        setIsEditModalOpen(true);
    }

    /** This function is called when the user clicks on "Assign Office" in the add new employee modal or the "Update
     * Office" button in the add new employee modal or the edit employee modal.
     * @param formData
     */
    const activateAssignMode = async (formData: FormData) => {

        const editedEmployee = parseEmployeeFormData(formData);

        setAssignMode(true);

        // get all offices
        // passing state as a parameter since setStates are async
        await runSearch(undefined, true)

        setSelectedFilterTags(new Set(["office"]));

        if (isAddNewEmployeeModalOpen) {

            setDraftNewEmployee(editedEmployee);

            openCloseAddNewEmployeeModal(false, false)
        } else {

            setSelectedSearchResult({
                ...editedEmployee,
                type: "employee",
            });

            setIsEditModalOpen(false);
        }
    }

    const assignOfficeClickHandler = (assignedOfficeNumber: string) => {

        setAssignMode(false)

        /** For add new employee modal, we use the draftNewEmployee state to track edits before user clicks
         * on "Assign Office".
         * For edit employee modal, we use the selectedSearchResult state to track edits before user clicks
         * on "Assign Office".
         */
        if (draftNewEmployee) {

            // We are in add new employee modal
            setDraftNewEmployee({
                ...draftNewEmployee,
                office_number: assignedOfficeNumber
            })

            openCloseAddNewEmployeeModal(true)
        } else {

            if (selectedSearchResult && selectedSearchResult.type === "employee") {

                // We are in edit employee modal
                setSelectedSearchResult({
                    ...selectedSearchResult,
                    office_number: assignedOfficeNumber
                })

                setIsEditModalOpen(true)
            }
        }
    }

    const parseEmployeeFormData = (formData: FormData): Employee => {
        return {
            first_name: formData.get("firstName") as string,
            alternate_name: formData.get("alternateName") as string || null,
            last_name: formData.get("lastName") as string,
            employee_id: formData.get("employeeId") as string,
            idir: formData.get("idir") as string,
            office_number: formData.get("officeNumber") as string,
            notes: formData.get("notes") as string || null,
        }
    }

    const parseWorkstationFormData = (formData: FormData): Workstation => {
        return {
            asset_tag: formData.get("assetTag") as string,
            notes: formData.get("notes") as string || null,
        }
    }

    const addSuccessAlert = (description: string, timeInMs: number = 6500) => {

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
                employee_id: selectedSearchResult.employee_id,
                idir: selectedSearchResult.idir
            }

            await updateEmployeeAction(updatedEmployee)
        }
    }

    const handleEditWorkstation = async (formData: FormData) => {
        if (selectedSearchResult?.type === "workstation") {

            const updatedWorkstation: Workstation = {
                ...parseWorkstationFormData(formData),
                asset_tag: selectedSearchResult.asset_tag,
            }

            await updateWorkstationAction(updatedWorkstation)
        }
    }

    const editHandlers: Record<Entity["type"], (fd: FormData) => Promise<void>> = {
        employee: handleEditEmployee,
        office: handleEditOffice,
        workstation: handleEditWorkstation
    }

    const handleEdit = async (formData: FormData) => {

        if (selectedSearchResult) {
            await editHandlers[selectedSearchResult.type](formData);

            refreshSearchResults()

            setIsEditModalOpen(false);

            addSuccessAlert(`${ENTITY_TYPE_NAME[selectedSearchResult.type]} details updated!`);
        }
    }

    const handleDeleteEmployee = async () => {

        if (selectedSearchResult?.type === "employee") {
            await deleteEmployeeAction(selectedSearchResult.employee_id);

            // We update previous search results in case an employee is deleted
            refreshSearchResults()

            setIsDeleteAlertDialogOpen(false)
            setIsEditModalOpen(false)

            addSuccessAlert(`Employee '${getEmployeeFullName(selectedSearchResult)}' deleted!`)
        }
    }

    const handleAddNewEmployee = async (formData: FormData) => {

        const newEmployee: Employee = parseEmployeeFormData(formData)

        const result = await addNewEmployeeAction(newEmployee)

        refreshSearchResults()

        openCloseAddNewEmployeeModal(false)

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

    const openCloseAddNewEmployeeModal = (openModal: boolean, clearDraftEditsOnClose: boolean = true) => {
        setIsAddNewEmployeeModalOpen(openModal)

        if (!openModal && clearDraftEditsOnClose) {
            setDraftNewEmployee(undefined)
        }
    }

    const handleAddNewWorkstation = async (formData: FormData) => {

        const newWorkstation = parseWorkstationFormData(formData)

        await addNewWorkstationAction(newWorkstation)

        refreshSearchResults()

        setIsAddNewWorkstationModalOpen(false)

        addSuccessAlert(`New workstation '${newWorkstation.asset_tag}' added!`);
    }

    return {
        searchResults,
        selectedFilterTags,
        setSelectedFilterTags,
        assignMode,
        draftNewEmployee,
        selectedSearchResult,
        alert,
        setAlert,
        isEditModalOpen,
        setIsEditModalOpen,
        isDeleteAlertDialogOpen,
        setIsDeleteAlertDialogOpen,
        isAddNewEmployeeModalOpen,
        setIsAddNewEmployeeModalOpen,
        isAddNewWorkstationModalOpen,
        setIsAddNewWorkstationModalOpen,
        openSearchResultEditModal,
        userHasSearchedOnce,
        handleSearch,
        handleEdit,
        handleDeleteEmployee,
        handleAddNewEmployee,
        openCloseAddNewEmployeeModal,
        handleAddNewWorkstation,
        activateAssignMode,
        assignOfficeClickHandler
    }
}
