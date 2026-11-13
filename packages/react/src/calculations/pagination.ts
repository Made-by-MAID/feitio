/** One entry of a Pagination: a page number, or a gap (…) between pages that are not next to each other. */
export type PageEntry = { kind: 'page'; page: number } | { kind: 'gap'; after: number };

/** The pages a Pagination shows: the first, the last, and the ones around the current, with gaps between. */
export function paginationEntries(current: number, total: number): PageEntry[] {
  const around = [current - 1, current, current + 1].filter((p) => p >= 1 && p <= total);
  const pages = [...new Set([1, ...around, total])].sort((a, b) => a - b);
  const entries: PageEntry[] = [];
  pages.forEach((page, i) => {
    const before = pages[i - 1];
    if (before !== undefined && page - before > 1) entries.push({ kind: 'gap', after: before });
    entries.push({ kind: 'page', page });
  });
  return entries;
}
