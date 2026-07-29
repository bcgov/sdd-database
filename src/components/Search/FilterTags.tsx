import {TagGroup, TagList} from "@bcgov/design-system-react-components";
import type {Selection} from "@react-types/shared";


interface FilterTagsProps {
    selectedFilterTags: Selection;
    setSelectedFilterTags: (selectedFilterTags: Selection) => void;
    disableFilterTags: boolean;
}


export function FilterTags({selectedFilterTags, setSelectedFilterTags, disableFilterTags}: FilterTagsProps) {

    const disabledKeys = [
        "employee",
        "office",
        "workspace",
        "workstation",
        "mobileDevice",
        "mobilePlan"
    ]

    return (
        <TagGroup aria-label="Search Tags"
                  selectionMode="multiple"
                  selectedKeys={selectedFilterTags}
                  onSelectionChange={setSelectedFilterTags}
                  disabledKeys={disableFilterTags? disabledKeys : []}
                  style={{margin: "1rem"}}
        >
            <TagList
                items={
                    [
                        {
                            id: "employee",
                            textValue: "Employees",
                            size: "medium",
                            color: "bc-gold",
                        },
                        {
                            id: "office",
                            textValue: "Offices",
                            size: "medium",
                            color: "green",
                        },
                        {
                            id: "workspace",
                            textValue: "Workspaces",
                            size: "medium",
                            color: "blue",
                        },
                        {
                            id: "workstation",
                            textValue: "Workstations",
                            size: "medium",
                            color: "red",
                        },
                        {
                            id: "mobileDevice",
                            textValue: "Mobile Devices",
                            size: "medium",
                            color: "yellow",
                        },
                        {
                            id: "mobilePlan",
                            textValue: "Mobile Plan",
                            size: "medium",
                            color: "grey",
                        }
                    ]}
            >
            </TagList>
        </TagGroup>
    )
}
