export interface Pagination {
  page: number;
  limit: number;
}

export const defaultPagination: Pagination = {
  page: 1,
  limit: 10,
};
