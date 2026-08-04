import {
    AccordionGroup,
    Form
} from "@bcgov/design-system-react-components";
import {addNewMobilePlanAction} from "@/actions/entities/mobile-plan/actions";
import {MobilePlanDetails} from "@/components/EntityForms/MobilePlan/MobilePlanDetails";
import {FormActionButtons} from "@/components/EntityForms/Shared/FormActionButtons";
import {useMobilePlanLookupProps} from "@/components/EntityForms/MobilePlan/useMobilePlanLookupProps";
import {useEntityFormActionState} from "@/hooks/entity/useEntityFormActionState";
import {ModalContentLayout} from "@/components/ModalContentLayout";


interface MobilePlanCreateFormProps {
    onSuccess: () => void
    onError: (error: string) => void
    onClose: () => void
}

export function MobilePlanCreateForm({
                                         onSuccess,
                                         onError,
                                         onClose
                                     }: MobilePlanCreateFormProps) {
    const {formAction, isPending} = useEntityFormActionState({
        serverAction: addNewMobilePlanAction,
        onSuccess,
        onError
    })

    const mobilePlanLookupProps = useMobilePlanLookupProps()

    return (
        <Form action={formAction}
              style={{
                  display: "flex",
                  flex: "1 1 auto",
                  flexDirection: "column",
                  minHeight: 0,
                  overflow: "clip"
              }}
        >
            <ModalContentLayout footer={
                <FormActionButtons isEditMode={false}
                                   isPending={isPending}
                                   onClose={onClose}
                >
                </FormActionButtons>
            }>
                <AccordionGroup allowsMultipleExpanded
                                defaultExpandedKeys={["mobilePlanDetails"]}
                                style={{
                                    marginTop: "1rem",
                                    marginBottom: "1rem"
                                }}
                >
                    <MobilePlanDetails {...mobilePlanLookupProps}
                                       isReadOnly={false}
                    >
                    </MobilePlanDetails>
                </AccordionGroup>
            </ModalContentLayout>
        </Form>
    )
}
