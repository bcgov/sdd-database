"use client";

import {Header, Footer} from "@bcgov/design-system-react-components"

export default function Updates() {

    const changelog = [
        {
            version: "v0.0.4",
            notes: [
                "Added this secret updates page to capture progress across versions",
                "Added visual feedback for user to indicate successful/unsuccessful new employee creation",
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