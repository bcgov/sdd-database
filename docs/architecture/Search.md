# 🔍 Search – UI Rules

This table defines how the search UI behaves in different scenarios.

---

## 📌 Search Behavior Table

| Case | Condition | Filters Visible | Message / Results |
|------|-----------|-----------------|-------------------|
| Initial load | `searchPhrase === undefined` | ❌ Hidden | None (only search bar shown) |
| No results at all (no filters applied) | `searchResults.length = 0` | ✅ Shown | "No results found" |
| No results at all (filters applied) | `searchResults.length = 0` | ✅ Shown | "No filtered search results found" |
| Results exist but filters exclude all | `filteredSearchResults.length = 0` | ✅ Shown | "No filtered search results found" |
| Results exist & filters match some | `filteredSearchResults.length > 0` | ✅ Shown | Render filtered list |