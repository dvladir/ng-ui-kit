import {Observable} from 'rxjs';
import {PaginationData} from '../../shared/pagination-data';
import {SortField} from '../../shared/sort-field';

export abstract class PaginationSetup<T> {
  abstract setup(
    refresh$: Observable<unknown>,
    pageSize$: Observable<number>,
    currentPage$: Observable<number>,
    sort$: Observable<SortField>,
  ): Observable<PaginationData<T>>;
}
