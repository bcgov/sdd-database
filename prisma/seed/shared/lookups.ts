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

/** Pulls all existing ProgramArea rows from DB and builds a lookup map like:
 * "Community Services::Area A Staff" -> 7
 *
 * That allows your Excel text fields:
 *  •	Branch
 *  •	Program Area
 *  to be converted into the foreign key:
 *  program_area_id
 */
export function buildProgramAreaLookup(
    rows: Array<{
        id: number
        name: string
        branch: { name: string }
    }>
) {
    const lookup = new Map<string, number>()

    for (const row of rows) {
        const key = `${row.branch.name}::${row.name}`
        lookup.set(key, row.id)
    }

    return lookup
}
