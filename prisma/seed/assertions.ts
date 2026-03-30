export function assertNoDuplicates<T, K extends string | number>(
    rows: T[],
    options: {
        getKey: (row: T) => K
        label: string
        shouldSkip?: (row: T) => boolean
    }
) {
    const {getKey, label, shouldSkip} = options

    const seen = new Map<K, T>()
    const duplicates: T[] = []

    for (const row of rows) {
        if (shouldSkip?.(row)) continue

        const key = getKey(row)

        if(seen.has(key)) {
            duplicates.push(row)

            console.error(`Duplicate ${label} found:`, {
                first: seen.get(key),
                duplicate: row
            })
        } else {
            seen.set(key, row)
        }
    }

    if(duplicates.length > 0) {
        throw new Error(`Found ${duplicates.length} duplicate ${label} rows. Check logs above.`)
    }
}
