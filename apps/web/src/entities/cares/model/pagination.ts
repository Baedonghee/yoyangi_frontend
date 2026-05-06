export function getTotalPages(itemCount: number, itemsPerPage: number) {
  return Math.max(1, Math.ceil(itemCount / itemsPerPage));
}

export function getSharedTotalPages(
  itemCounts: number[],
  itemsPerPage: number,
) {
  return Math.max(
    1,
    ...itemCounts.map((itemCount) => getTotalPages(itemCount, itemsPerPage)),
  );
}

export function getPagedItems<T>(
  items: T[],
  page: number,
  itemsPerPage: number,
) {
  const currentPage = Math.max(1, page);

  return items.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
}
