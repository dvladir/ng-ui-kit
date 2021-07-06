import {combineLatest, Observable} from 'rxjs';
import {PaginationSetup} from './pagination-setup';
import {PaginationData} from '../../shared/pagination-data';
import {distinctUntilChanged, switchMap, tap} from 'rxjs/operators';
import {SortField} from '../../shared/sort-field';
import {Indicator} from '../../../indicator/public-api';

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
    sort$: Observable<SortField>,
    indicator?: Indicator
  ): Observable<PaginationData<T>> {

    return combineLatest(pageSize$, currentPage$, sort$, refresh$)
      .pipe(
        tap(() => {
          if (indicator) {
            indicator.show();
          }
        }),
        switchMap(([pageSize, currentPage, sort]) => this._config.getData(pageSize, currentPage, sort)),
        distinctUntilChanged(),
        tap((data) => {
          if (indicator) {
            indicator.hide();
          }
        })
      );

  }
}
