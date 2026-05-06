export function normalizeMobileDeviceModelName(rawModelName: string) {
    const remappedModelNames: Record<string, string> = {
        "iPhone 11": "Apple iPhone 11",
        "iPhone 14": "Apple iPhone 14",
        "iPhone 16": "Apple iPhone 16",
        "iPhone 16E": "Apple iPhone 16e",

        "iPhone SE": "Apple iPhone SE",
        "iPhone SE2": "Apple iPhone SE 2nd Gen",
        "iPhone SE3": "Apple iPhone SE 3rd Gen",

        "OiaB": "Office in a Box (OiaB)",

        "Samsung Galaxy A03S": "Samsung Galaxy A03s",
        "Samsung A32": "Samsung Galaxy A32"
    }

    return remappedModelNames[rawModelName] ?? rawModelName
}
