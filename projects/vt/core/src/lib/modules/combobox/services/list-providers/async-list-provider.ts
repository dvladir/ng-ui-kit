import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {distinctUntilChanged, map, shareReplay, switchMap, takeUntil, throttleTime} from 'rxjs/operators';
import {ListProvider} from './list-provider';
import {ValueLabel} from '../../shared/value-label';
import {AsyncDataSource} from '../../shared/async-data-source';

export class AsyncListProvider<ID, ITEM> implements ListProvider<ID>{

  constructor(
    private _dataSource: AsyncDataSource<ID, ITEM>
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

  readonly items$: Observable<ReadonlyArray<ValueLabel<ID>>> = this._searchValue$.pipe(
    throttleTime(100),
    map(search => (search || '').toLowerCase().trim()),
    distinctUntilChanged(),
    switchMap(query => this._dataSource.searchItems(query)),
    map(items => items.map(x => this._dataSource.convertItem(x))),
    shareReplay(1),
    takeUntil(this._terminator$)
  );

  cleanup(): void {
    this._searchValue$.complete();
    this._terminator$.next();
    this._terminator$.complete();
  }

  async getLabelsByValues(...values: ReadonlyArray<ID>): Promise<ReadonlyArray<string>> {
    const items = await this._dataSource.getItemsByIds(...values).toPromise();

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
