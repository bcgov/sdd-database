import {TagGroup, TagList} from "@bcgov/design-system-react-components";
import type {Selection} from "@react-types/shared";


interface FilterTagsProps {
    selectedFilterTags: Selection;
    setSelectedFilterTags: (selectedFilterTags: Selection) => void;
    disableFilterTags: boolean;
}


export function FilterTags({selectedFilterTags, setSelectedFilterTags, disableFilterTags}: FilterTagsProps) {

    return (
        <TagGroup aria-label="Search Tags"
                  selectionMode="multiple"
                  selectedKeys={selectedFilterTags}
                  onSelectionChange={setSelectedFilterTags}
                  disabledKeys={disableFilterTags? ["employee", "office", "workstation"] : []}
                  style={{margin: "1rem"}}
        >
            <TagList
                items={
                    [
                        {
                            id: "employee",
                            textValue: "Employees",
                            size: "medium",
                            color: "green",
                        },
                        {
                            id: "office",
                            textValue: "Offices",
                            size: "medium",
                            color: "red",
                        },
                        {
                            id: "workstation",
                            textValue: "Workstations",
                            size: "medium",
                            color: "yellow",
                        },
                    ]}
            >
            </TagList>
        </TagGroup>
    )
}
