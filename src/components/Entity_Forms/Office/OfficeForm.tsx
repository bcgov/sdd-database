import type {Office} from "@/generated/prisma/client";

import {OfficeFields} from "@/components/Entity_Forms/Office/OfficeFields";
import {useOfficeLookupProps} from "@/components/Entity_Forms/Office/useOfficeLookupProps";


interface OfficeFormProps {
    office: Office;
}

export function OfficeForm(props: OfficeFormProps) {

    const officeLookupProps = useOfficeLookupProps(props.office);

    return <OfficeFields {...officeLookupProps} isReadOnly/>
}
