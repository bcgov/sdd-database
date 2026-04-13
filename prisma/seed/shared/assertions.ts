export function assertNoDuplicates<T, K extends string | number>(
    rows: T[],
    options: {
        getKey: (row: T) => K
        label: string
        shouldSkip?: (row: T) => boolean
        caseInsensitive?: boolean
    }
) {
    const {
        getKey,
        label,
        shouldSkip,
        caseInsensitive = false
    } = options

    const seen = new Map<string | number, T>()
    const duplicates: T[] = []

    for (const row of rows) {
        if (shouldSkip?.(row)) continue

        const rawKey = getKey(row)

        const key =
            typeof rawKey === 'string' && caseInsensitive
        ? rawKey.toLowerCase()
                : rawKey

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
