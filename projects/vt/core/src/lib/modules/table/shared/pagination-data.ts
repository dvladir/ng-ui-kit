import {SortField} from './sort-field';

export interface PaginationData<T> {
  readonly currentPage: number;
  readonly pageSize: number;
  readonly totalPages: number;
  readonly totalElements: number;
  readonly elements: ReadonlyArray<T>;
  readonly sort: SortField;
}
