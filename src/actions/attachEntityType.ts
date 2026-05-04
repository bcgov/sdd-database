export function attachEntityType<Row, EntityTypeName extends string>(
    rows: Row[],
    entityType: EntityTypeName,
): Array<Row & {type: EntityTypeName}> {
    return rows.map(row => ({
        ...row,
        type: entityType
    }))
}
