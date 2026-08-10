export type KeywordSearchQuery = {
  value: string;
  isDigitsOnly: boolean;
};

/**
 * Keyword searches treat digits as an identifier search. This prevents a
 * query such as "11" from also matching descriptive values such as
 * "Microsoft Surface Pro 11".
 */
export function parseKeywordSearchQuery(
  query: string,
): KeywordSearchQuery | undefined {
  const value = query.trim();

  if (!value) return undefined;

  return {
    value,
    isDigitsOnly: /^\d+$/.test(value),
  };
}

export function buildAssignedEmployeeSearchFilter(
  searchQuery: KeywordSearchQuery,
) {
  const { value, isDigitsOnly } = searchQuery;

  return {
    assigned_employee: {
      is: {
        OR: [
          { idir: { equals: value, mode: "insensitive" as const } },
          { employee_id: { equals: value, mode: "insensitive" as const } },
          ...(!isDigitsOnly
            ? [
                {
                  first_name: {
                    contains: value,
                    mode: "insensitive" as const,
                  },
                },
                {
                  alternate_name: {
                    contains: value,
                    mode: "insensitive" as const,
                  },
                },
                {
                  last_name: {
                    contains: value,
                    mode: "insensitive" as const,
                  },
                },
              ]
            : []),
        ],
      },
    },
  };
}
