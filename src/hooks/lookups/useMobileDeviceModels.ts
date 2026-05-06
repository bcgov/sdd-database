import {useCallback} from "react";
import {fetchMobileDeviceModelsAction} from "@/actions/lookups/mobileDeviceModels";
import {useLookup} from "@/hooks/lookups/useLookup";


export function useMobileDeviceModels() {
    const fetcher = useCallback(() => fetchMobileDeviceModelsAction(), [])

    const {data} = useLookup(fetcher, "mobile device models")

    return { mobileDeviceModels: data }
}
