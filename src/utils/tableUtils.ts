// utils/tableUtils.ts
export function descendingComparator<T>(a: T, b: T, orderBy: keyof T): number {
  const aValue = a[orderBy];
  const bValue = b[orderBy];

  // Handle undefined values
  if (aValue === undefined || bValue === undefined) {
    return 0; // Treat undefined values as equal
  }

  // Handle string comparison, including dates
  if (typeof aValue === "string" && typeof bValue === "string") {
    const dateA = Date.parse(aValue);
    const dateB = Date.parse(bValue);

    // Compare as dates if both strings are valid dates
    if (!isNaN(dateA) && !isNaN(dateB)) {
      return dateB - dateA;
    }

    // Fallback to localeCompare for other strings
    return bValue.localeCompare(aValue);
  }

  // Handle numeric comparison
  if (typeof aValue === "number" && typeof bValue === "number") {
    if (bValue < aValue) return -1;
    if (bValue > aValue) return 1;
  }

  return 0; // Fallback if types do not match
}


export function getComparator<Key extends keyof any>(
  order: "asc" | "desc",
  orderBy: Key
): (
  a: { [key in Key]: number | string | undefined },
  b: { [key in Key]: number | string | undefined }
) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}
