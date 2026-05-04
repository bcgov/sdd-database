import {Accordion, Checkbox, CheckboxGroup} from "@bcgov/design-system-react-components";
import {LookupOption} from "@/types";


interface OhsAccommodationsProps {
    ohsAccommodationTypes: LookupOption[]
    selectedOhsAccommodationTypeIds: number[]
}

export function OhsAccommodations({
                                             ohsAccommodationTypes,
                                             selectedOhsAccommodationTypeIds,
                                         }: OhsAccommodationsProps
) {
    return (
        <Accordion label="Occupational Health and Safety Accommodations" id="ohsAccommodations">
            <CheckboxGroup label="Select 0 or more that apply"
                           name="ohsAccommodationTypeIds"
                           defaultValue={selectedOhsAccommodationTypeIds.map(String)}>
                {ohsAccommodationTypes.map((accommodationType) => (
                    <Checkbox key={accommodationType.id}
                              value={String(accommodationType.id)}>
                        {accommodationType.name}
                    </Checkbox>
                ))}
            </CheckboxGroup>
        </Accordion>
    )
}
