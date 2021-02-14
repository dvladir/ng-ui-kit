import {combineLatest, Observable} from 'rxjs';
import {PaginationSetup} from './pagination-setup';
import {PaginationData} from '../../shared/pagination-data';
import {switchMap} from 'rxjs/operators';
import {SortField} from '../../shared/sort-field';

export interface RemotePaginationConfig<T> {
  getData(pageSize: number, currentPage: number, sort: SortField): Observable<PaginationData<T>>;
}

export class RemotePaginationSetup<T> implements PaginationSetup<T>{

  constructor(
    private _config: RemotePaginationConfig<T>
  ) {
  }

  setup(
    refresh$: Observable<unknown>,
    pageSize$: Observable<number>,
    currentPage$: Observable<number>,
    sort$: Observable<SortField>
  ): Observable<PaginationData<T>> {

    return combineLatest(pageSize$, currentPage$, sort$, refresh$)
      .pipe(
        switchMap(([pageSize, currentPage, sort]) => this._config.getData(pageSize, currentPage, sort))
      );

  }
}
