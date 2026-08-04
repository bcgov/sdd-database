import {EntityActionResult} from "@/types";
import {useActionState, useEffect, useRef} from "react";


type EntityFormAction = (
    prevState: EntityActionResult,
    formData: FormData
) => Promise<EntityActionResult>

interface UseEntityFormActionStateProps {
    serverAction: EntityFormAction
    onSuccess: () => void
    onError: (error: string) => void
}

export function useEntityFormActionState({
                                             serverAction,
                                             onSuccess,
                                             onError,
                                         }: UseEntityFormActionStateProps) {

    const initialState: EntityActionResult = {status: "idle"}

    const [result, formAction, isPending] = useActionState(
        serverAction,
        initialState
    )

    // A callback may legitimately change identity when a parent rerenders.
    // The same completed action result must still be handled only once.
    const handledResultRef = useRef<EntityActionResult | undefined>(undefined)

    useEffect(() => {

        if (result.status === "idle" || handledResultRef.current === result) {
            return
        }

        handledResultRef.current = result

        switch (result.status) {
            case "ok":
                onSuccess();
                break;

            case "error":
                onError(result.error);
                break;
        }

    }, [result, onError, onSuccess]);

    return {
        formAction,
        isPending
    }
}
