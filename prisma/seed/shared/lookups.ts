export const idNameSelect = {
    id: true,
    name: true
} as const

export function buildIdLookupByName(
    rows: Array<{
        id: number
        name: string
    }>
) {
    const lookup = new Map<string, number>()

    for (const row of rows) {
        lookup.set(row.name, row.id)
    }

    return lookup
}
