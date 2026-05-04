import {EntityActionResult} from "@/types";
import {useActionState, useEffect} from "react";


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

    useEffect(() => {

        switch (result.status) {
            case "idle":
                // first render -> do nothing
                return;

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
