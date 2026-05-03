import {useCallback, useState} from "react";


interface Alert {
    variant: "success" | "danger";
    title?: string;
    description?: string;
}

export function useEntityAlerts() {
    const [alert, setAlert] = useState<Alert>();

    const addSuccessAlert = useCallback((description: string) => {

        const ALERT_TIMEOUT = 8500;

        setAlert({
            variant: "success",
            title: "Success",
            description: description
        })

        // Auto-hide the success alert message after ALERT_TIMEOUT seconds
        setTimeout(() => {
            setAlert(undefined);
        }, ALERT_TIMEOUT)
    }, [])

    const addErrorAlert = useCallback((title: string, description: string) => {

        setAlert({
            variant: "danger",
            title,
            description
        })
    }, [])

    return {
        alert,
        setAlert,
        addSuccessAlert,
        addErrorAlert,
    }
}
