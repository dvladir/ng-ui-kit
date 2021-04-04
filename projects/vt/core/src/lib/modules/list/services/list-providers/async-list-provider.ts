import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {distinctUntilChanged, map, shareReplay, skip, switchMap, takeUntil, tap, throttleTime} from 'rxjs/operators';
import {ListProvider} from './list-provider';
import {ValueLabel} from '../../../../_common/value-label';
import {AsyncDataSource} from '../../shared/async-data-source';
import {Indicator} from '../../../indicator/public-api';

export class AsyncListProvider<ID, ITEM> implements ListProvider<ID>{

  constructor(
    private _dataSource: AsyncDataSource<ID, ITEM>,
    private _indicator: Indicator
  ) {
  }

  get searchValue(): string {
    return this._searchValue$.value;
  }

  set searchValue(value: string) {
    if (value === this.searchValue) {
      return;
    }
    this._searchValue$.next(value);
  }

  private _terminator$: Subject<any> = new Subject<any>();

  private _searchValue$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  private _searchValuePrepared$: Observable<string> = this._searchValue$.pipe(
    skip(1),
    throttleTime(100),
    map(search => (search || '').toLowerCase().trim()),
    distinctUntilChanged()
  );

  readonly items$: Observable<ReadonlyArray<ValueLabel<ID>>> = this._searchValuePrepared$.pipe(
    tap(() => this._indicator.show()),
    switchMap(query => this._dataSource.searchItems(query)),
    tap(() => this._indicator.hide()),
    map(items => items.map(x => this._dataSource.convertItem(x))),
    shareReplay(1),
    takeUntil(this._terminator$)
  );

  get isPending(): boolean {
    return this._indicator.isInProgress;
  }

  cleanup(): void {
    this._searchValue$.complete();
    this._terminator$.next();
    this._terminator$.complete();
  }

  async getLabelsByValues(...values: ReadonlyArray<ID>): Promise<ReadonlyArray<string>> {
    this._indicator.show();
    const items = await this._dataSource.getItemsByIds(...values).toPromise();
    this._indicator.hide();

    const valuesMap: Map<ID, string> = items.reduce((res, x) => {
      const {value, label} = this._dataSource.convertItem(x);
      res.set(value, label!);
      return res;
    }, new Map<ID, string>());

    const result: ReadonlyArray<string> = values.map(x => valuesMap.get(x) || '');

    valuesMap.clear();

    return result;
  }
}
