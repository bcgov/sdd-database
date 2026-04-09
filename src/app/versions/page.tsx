"use client";

import {Header, Footer} from "@bcgov/design-system-react-components"

export default function Updates() {

    const changelog = [
        {
            version: "v0.0.26",
            notes: [
                "Added the long awaited scroll wheel to the employee modal",
                "Delete button on the empoyee modal now lives on the same line as the save and cancel buttons",
                "Added a 'Go Back' button in Workspace/Office Assignment page to cancel and exit midway",
                "Display workspace status: Available, On Hold or Occupied",
                "Workspace Assignment now no longer shows workspaces currently on hold"
            ]
        },
        {
            version: "v0.0.25",
            notes: [
                "Added Workspace Category",
                "Can check out extra details by clicking on search results during office/workspace assignment"
            ]
        },
        {
            version: "v0.0.24",
            notes: [
                "Added Job Tile field",
            ]
        },
        {
            version: "v0.0.23",
            notes: [
                "Added workspace entity which shows workspace number, office number and assigned employee details",
                "Employee supports workspace assignment",
                "Dev and Test environments are now only accessible within the gov network (in a gov office, or on" +
                " the VPN)"
            ]
        },
        {
            version: "v0.0.22",
            notes: [
                "Employees can now be created without an Employee ID",
                "Employee search results now display IDIR instead of employee id in brackets"
            ]
        },
        {
            version: "v0.0.21",
            notes: [
                "First Name and Last Name (like Alternate Name) now support multiple words unlike only accepting" +
                " single words that it did so far",
                "Additionally, name fields now accept periods, hyphens and apostrophes",
                "Employees can now be created without an IDIR"
            ]
        },{
            version: "v0.0.20",
            notes: [
                "Add all offices from the Office Information table in Access Database"
            ]
        },
        {
            version: "v0.0.19",
            notes: [
                "Clean up office popup"
            ]
        },
        {
            version: "v0.0.18",
            notes: [
                "Add type of client services dropdown for an office"
            ]
        },
        {
            version: "v0.0.17",
            notes: [
                "Add office type dropdown"
            ]
        },
        {
            version: "v0.0.16",
            notes: [
                "Add city field to office modal"
            ]
        },
        {
            version: "v0.0.15",
            notes: [
                "Add address field to office modal"
            ]
        },
        {
            version: "v0.0.14",
            notes: [
                "Remove notes field from office modal"
            ]
        },
        {
            version: "v0.0.13",
            notes: [
                "Added Program Area field for Employee"
            ]
        },
        {
            version: "v0.0.12",
            notes: [
                "Search now works with branch names as well",
                "Fixed a bug that prevented office assign mode to load list of offices by default"
            ]
        },
        {
            version: "v0.0.11",
            notes: [
                "Added Branch field for Employee"
            ]
        },
        {
            version: "v0.0.10",
            notes: [
                "In the browser, tab title now has the environment name: Employee Information (Development) or" +
                " Employee Information (Test)"
            ]
        },{
            version: "v0.0.9",
            notes: [
                "Test environment is now live",
            ]
        },
        {
            version: "v0.0.8",
            notes: [
                "Added field validations restricting typos and preventing inaccurate data entry",
                "Performance improvements across the board especially with the delete operation",
                "Search Filter Tags are now always visible despite no search results being present",
            ]
        },
        {
            version: "v0.0.7",
            notes: [
                "Fixed bug allowing users to add duplicate IDIR employees by changing case"
            ]
        },
        {
            version: "v0.0.6",
            notes: [
                "Added unique error message for duplicate IDIR employee insertion attempt"
            ]
        },{
            version: "v0.0.5",
            notes: [
                "Added Offices",
                "Added Workstations",
                "Added filtering capability for search results",
                "Added option to select an office for a employee (through the 'Assign Office' button)",
                "Added IDIR and Alternate Name fields from the employee table",
                "Removed the Middle Name field from the employee table"

            ]
        },
        {
            version: "v0.0.4",
            notes: [
                "Added this secret updates page to capture progress across versions",
                "Added more employee fields + Touched up styling for the Add New Employee modal",
                "Added visual feedback for user to indicate successful/unsuccessful actions like adding new" +
                " employees, deleting, saving edits",
                "Touched up styling for Search Results - made them clickable",
                "Added edit functionality",
                "Added delete functionality + delete confirmation dialog",
            ]
        },
        {
            version: "v0.0.3",
            notes: [
                "Connected the emplyee table in database with the application",
                "Search box now works for searching employees using employee number or first name",
                "'Add New Employee' modal now works adding new employee in the database",
                "Minimum Viable Product (MVP) Complete",
            ]
        },
        {
            version: "v0.0.2",
            notes: [
                "Created a non-functional search box",
                "Created a 'Add New Employee' button",
                "Created a non-functional 'Add New Employee' modal with first name and employee number fields",
                "Integerated the BC Gov Design System"
            ]
        },
        {
            version: "v0.0.1",
            notes: [
                "Deployed this app on OpenShift, making this website accessible on any laptop not just mine"
            ]
        },
    ]

    return (
        <div className="p-4">
            <Header title="Project Versions"></Header>
            <ul>
                {changelog.map(({version, notes}, index) => (
                    <div key={version}>
                        <li className="mb-2">
                            <strong>{version}</strong>
                            <ul className="ml-4 list-disc">
                                {notes.map((note, idx) => (
                                    <li key={idx}>{note}</li>
                                ))}
                            </ul>
                        </li>
                        {index !== changelog.length - 1 && <hr className="my-6 border-gray-300"/>}
                    </div>
                ))}
            </ul>
            <Footer hideAcknowledgement hideLogoAndLinks></Footer>
        </div>
    )
}