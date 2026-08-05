"use client";

import { Header, Footer } from "@bcgov/design-system-react-components";

export default function Updates() {
  const changelog = [
    {
      version: "v0.0.44",
      notes: [
        "Fix saving employee updates when the employee already has an assigned resident workspace",
        "Added a report suite (17 reports) to download workspace data in Excel format",
      ],
    },
    {
      version: "v0.0.43",
      notes: [
        "Mobile Devices can now be assigned a Mobile Plan during creation or editing",
        "Only active, unassigned Mobile Plans can be selected for assignment",
        "Mobile Plan assignment is now disabled while previewing a Mobile Device during employee assignment",
        "Standardize modal sizing so overflowing content uses a single scroll area",
        "Fix OHS accommodation selection causing the Employee modal content to disappear",
      ],
    },
    {
      version: "v0.0.42",
      notes: [
        "Add optional Position No field to Workspaces",
        "Workspace search result names now identify on-hold workspaces and show Position No",
        "Workspaces can now be searched by Position No",
        "Workspace assignment now lists eligible on-hold workspaces",
        "Workspace hold changes are now saved only when Save is selected",
      ],
    },
    {
      version: "v0.0.41",
      notes: [
        "Add Data Allowance field to Mobile Plans",
        "Add Enhanced Voicemail field to Mobile Plans",
        "Mobile Plans can now be created",
        "Mobile Plans are now editable",
        "Standardize assignment action button layouts in the Employee modal",
      ],
    },
    {
      version: "v0.0.40",
      notes: [
        "Add Plan Status field to Mobile Plans",
        "Add Service Provider field to Mobile Plans",
        "Mobile Plan Search Results now display the Service Provider",
        "Mobile Plans are now searchable by Service Provider",
        "Mobile Plans now show the assigned Mobile Device's current Office Number",
      ],
    },
    {
      version: "v0.0.39",
      notes: [
        "Workstations can now be deleted",
        "Search now displays a count for the no of results returned",
        "Workspace Search Results now have the word protected in the title (if they have workspace" +
          " protections)",
        "Employee Search Results show the office number in the title",
        "Fix modal overflowing in smaller screens",
      ],
    },
    {
      version: "v0.0.38",
      notes: [
        "Add Enrolled Date (Order Date) field to Mobile Devices",
        "Add Hardware Fee End Date (Payment End Date) field to Mobile Devices",
        "Add a new Entity: Mobile Plan",
        "Add Cell Phone Number field to Mobile Plans",
      ],
    },
    {
      version: "v0.0.37",
      notes: [
        "Add Asset Disposal Report (ADR) Number Field in Mobile Devices",
        "Add General Incident Loss Report (GILR) Number Field in Mobile Devices",
        "Mobile Device assignment list for an employee now no longer shows devices that have either an ADR" +
          " number or GILR number",
      ],
    },
    {
      version: "v0.0.36",
      notes: [
        "Add employee assignment for mobile devices",
        "Employees can now be marked on leave",
      ],
    },
    {
      version: "v0.0.35",
      notes: [
        "Mobile Devices modal now has office number field, model selection field and notes field",
        "Restrict all notes fields to a maximum of 200 characters",
        "Employee Search Results are now sorted by name",
        "Workstation Search Results are now sorted by asset tag",
      ],
    },
    {
      version: "v0.0.34",
      notes: [
        "Added new entity: Mobile Devices",
        "Mobile Devices modal now has IMEI field",
        "Employee Search Results now display the alternate name if available",
        "Workspace Search Results now display the workspace category name",
      ],
    },
    {
      version: "v0.0.33",
      notes: [
        "Workstations are now searchable by their office number",
        "Workstations now take on the employee's office number if they are assigned to that employee",
        "Fixed an assignment related bug",
      ],
    },
    {
      version: "v0.0.32",
      notes: [
        "Add new Desk Type 'To Be Determined'",
        "Add Workspace Assignment Type field",
        "Show workstation's current office location",
      ],
    },
    {
      version: "v0.0.31",
      notes: [
        "Add Hardware Column",
        "Only the search results are scrollable now and not the whole page",
      ],
    },
    {
      version: "v0.0.30",
      notes: [
        "Employees can now assign Workstations",
        "You can now search for workstations using the assigned employee details and not just workstation" +
          " details",
        "Similarly, you can now search for workspaces using the assigned employee details and not just" +
          " workspace details",
      ],
    },
    {
      version: "v0.0.29",
      notes: ["Added Workspace Protections"],
    },
    {
      version: "v0.0.28",
      notes: ["Added Desk Type", "Added Office Floor"],
    },
    {
      version: "v0.0.27",
      notes: ["Added Employee OHS Accommodations"],
    },
    {
      version: "v0.0.26",
      notes: [
        "Added the long awaited scroll wheel to the employee modal",
        "Added a 'Go Back' button in Workspace/Office Assignment page to cancel and exit midway",
        "Display workspace status: Available, On Hold or Occupied",
        "Workspaces can now be put on hold and removed from hold status",
        "Workspace Assignment now no longer shows workspaces currently on hold",
      ],
    },
    {
      version: "v0.0.25",
      notes: [
        "Added Workspace Category",
        "Can check out extra details by clicking on search results during office/workspace assignment",
      ],
    },
    {
      version: "v0.0.24",
      notes: ["Added Job Title field"],
    },
    {
      version: "v0.0.23",
      notes: [
        "Added workspace entity which shows workspace number, office number and assigned employee details",
        "Employee supports workspace assignment",
        "Dev and Test environments are now only accessible within the gov network (in a gov office, or on" +
          " the VPN)",
      ],
    },
    {
      version: "v0.0.22",
      notes: [
        "Employees can now be created without an Employee ID",
        "Employee search results now display IDIR instead of employee id in brackets",
      ],
    },
    {
      version: "v0.0.21",
      notes: [
        "First Name and Last Name (like Alternate Name) now support multiple words unlike only accepting" +
          " single words that it did so far",
        "Additionally, name fields now accept periods, hyphens and apostrophes",
        "Employees can now be created without an IDIR",
      ],
    },
    {
      version: "v0.0.20",
      notes: [
        "Add all offices from the Office Information table in Access Database",
      ],
    },
    {
      version: "v0.0.19",
      notes: ["Clean up office popup"],
    },
    {
      version: "v0.0.18",
      notes: ["Add type of client services dropdown for an office"],
    },
    {
      version: "v0.0.17",
      notes: ["Add office type dropdown"],
    },
    {
      version: "v0.0.16",
      notes: ["Add city field to office modal"],
    },
    {
      version: "v0.0.15",
      notes: ["Add address field to office modal"],
    },
    {
      version: "v0.0.14",
      notes: ["Remove notes field from office modal"],
    },
    {
      version: "v0.0.13",
      notes: ["Added Program Area field for Employee"],
    },
    {
      version: "v0.0.12",
      notes: [
        "Search now works with branch names as well",
        "Fixed a bug that prevented office assign mode to load list of offices by default",
      ],
    },
    {
      version: "v0.0.11",
      notes: ["Added Branch field for Employee"],
    },
    {
      version: "v0.0.10",
      notes: [
        "In the browser, tab title now has the environment name: Employee Information (Development) or" +
          " Employee Information (Test)",
      ],
    },
    {
      version: "v0.0.9",
      notes: ["Test environment is now live"],
    },
    {
      version: "v0.0.8",
      notes: [
        "Added field validations restricting typos and preventing inaccurate data entry",
        "Performance improvements across the board especially with the delete operation",
        "Search Filter Tags are now always visible despite no search results being present",
      ],
    },
    {
      version: "v0.0.7",
      notes: [
        "Fixed bug allowing users to add duplicate IDIR employees by changing case",
      ],
    },
    {
      version: "v0.0.6",
      notes: [
        "Added unique error message for duplicate IDIR employee insertion attempt",
      ],
    },
    {
      version: "v0.0.5",
      notes: [
        "Added Offices",
        "Added Workstations",
        "Added filtering capability for search results",
        "Added option to select an office for a employee (through the 'Assign Office' button)",
        "Added IDIR and Alternate Name fields from the employee table",
        "Removed the Middle Name field from the employee table",
      ],
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
      ],
    },
    {
      version: "v0.0.3",
      notes: [
        "Connected the emplyee table in database with the application",
        "Search box now works for searching employees using employee number or first name",
        "'Add New Employee' modal now works adding new employee in the database",
        "Minimum Viable Product (MVP) Complete",
      ],
    },
    {
      version: "v0.0.2",
      notes: [
        "Created a non-functional search box",
        "Created a 'Add New Employee' button",
        "Created a non-functional 'Add New Employee' modal with first name and employee number fields",
        "Integerated the BC Gov Design System",
      ],
    },
    {
      version: "v0.0.1",
      notes: [
        "Deployed this app on OpenShift, making this website accessible on any laptop not just mine",
      ],
    },
  ];

  return (
    <div className="p-4">
      <Header title="Project Versions"></Header>
      <ul>
        {changelog.map(({ version, notes }, index) => (
          <div key={version}>
            <li className="mb-2">
              <strong>{version}</strong>
              <ul className="ml-4 list-disc">
                {notes.map((note, idx) => (
                  <li key={idx}>{note}</li>
                ))}
              </ul>
            </li>
            {index !== changelog.length - 1 && (
              <hr className="my-6 border-gray-300" />
            )}
          </div>
        ))}
      </ul>
      <Footer hideAcknowledgement hideLogoAndLinks></Footer>
    </div>
  );
}
