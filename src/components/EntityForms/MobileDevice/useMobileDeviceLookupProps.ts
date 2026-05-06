import {useMobileDeviceModels} from "@/hooks/lookups/useMobileDeviceModels";


export function useMobileDeviceLookupProps() {
    const {mobileDeviceModels} = useMobileDeviceModels()

    return {
        models: mobileDeviceModels ?? [],
    }
}
