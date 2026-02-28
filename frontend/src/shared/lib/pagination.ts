/**
 * Pagination logic constants and helpers
 */

/**
 * Threshold for displaying pagination.
 * Pagination should only be visible when there are at least this many elements.
 */
export const PAGINATION_THRESHOLD = 12;

/**
 * Determines if pagination should be displayed based on the item count.
 */
export const shouldShowPagination = (count: number): boolean => {
  return count >= PAGINATION_THRESHOLD;
};
