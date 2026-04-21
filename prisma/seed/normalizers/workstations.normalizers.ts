export function normalizeModelName(rawModelName: string) {
    const remappedModelNames: Record<string, string> = {
        "T14": "Lenovo ThinkPad T14",
        "T15": "Lenovo ThinkPad T15",
        "T16": "Lenovo ThinkPad T16",

        "T580": "Lenovo ThinkPad T580",
        "Thinkstation P360": "Lenovo ThinkStation P360",

        "Surface Pro 8": "Microsoft Surface Pro 8",
        "Surface Pro 11": "Microsoft Surface Pro 11",

        "High Performance": "Lenovo ThinkPad P16",
        "Mac Book Pro": "Apple MacBook Pro"
    }

    return remappedModelNames[rawModelName] ?? rawModelName
}
