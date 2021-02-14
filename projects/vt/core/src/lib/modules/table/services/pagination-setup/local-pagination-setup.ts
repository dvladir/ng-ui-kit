import {PaginationSetup} from './pagination-setup';
import {combineLatest, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {PaginationData} from '../../shared/pagination-data';
import {SortField} from '../../shared/sort-field';
import {Sort} from '../../shared/sort.enum';

export interface LocalPaginationConfig<T> {
  source$: Observable<ReadonlyArray<T>>;
  sortPredicates?: {
    [field: string]: (a: T, b: T) => number
  };
}

export class LocalPaginationSetup<T> implements PaginationSetup<T> {

  constructor(
    private _config: LocalPaginationConfig<T>
  ) {
  }

  setup(
    refresh$: Observable<unknown>,
    pageSize$: Observable<number>,
    currentPage$: Observable<number>,
    sort$: Observable<SortField>,
  ): Observable<PaginationData<T>> {

    const sortedData$ = combineLatest(
      this._config.source$,
      sort$
    ).pipe(
      map(([data, sort]) => {
        const predicate = this._config?.sortPredicates?.[sort.field];

        if (!predicate || sort.sort === Sort.none) {
          return {data, sort};
        }

        const result = [...data];
        result.sort((a, b) => {
          let sortResult = predicate(a, b);
          if (sort.sort === Sort.desc) {
            sortResult *= -1;
          }
          return sortResult;
        });

        return {data: result, sort};
      })
    );

    return combineLatest(
      pageSize$,
      currentPage$,
      sortedData$,
      refresh$
    ).pipe(
      map(([pageSize, currentPage, {data, sort}]) => {
        const totalElements = data.length;

        let totalPages: number = Math.floor(totalElements / pageSize);
        if (totalElements % pageSize !== 0) {
          totalPages++;
        }
        const start = currentPage * pageSize;
        const end = start + pageSize;

        const elements = data.slice(start, end);

        const result: PaginationData<T> = {currentPage, pageSize, totalPages, totalElements, elements, sort};
        return result;
      })
    );

  }

}
