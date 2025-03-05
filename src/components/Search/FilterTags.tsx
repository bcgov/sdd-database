import {TagGroup, TagList} from "@bcgov/design-system-react-components";
import type {Selection} from "@react-types/shared";


interface FilterTagsProps {
    setSelectedFilterTags: (selectedFilterTags: Selection) => void;
}


export function FilterTags({setSelectedFilterTags}: FilterTagsProps) {

    return (
        <TagGroup aria-label="Search Tags"
                  selectionMode="multiple"
                  onSelectionChange={setSelectedFilterTags}
        >
            <TagList
                items={
                    [
                        {
                            id: "employee",
                            textValue: "Employees",
                            size: "medium",
                            color: "yellow",
                        },
                        {
                            id: "office",
                            textValue: "Offices",
                            size: "medium",
                            color: "green",
                        },
                    ]}
            >
            </TagList>
        </TagGroup>
    )
}