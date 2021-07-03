import {BehaviorSubject, combineLatest, Observable, Subject} from 'rxjs';
import {ListProvider} from './list-provider';
import {ValueLabel} from '../../../../_common/value-label';
import {distinctUntilChanged, map, shareReplay, takeUntil, throttleTime} from 'rxjs/operators';

export class FixedListProvider<T> implements ListProvider<T>{

  constructor(
    private readonly _allItems: ReadonlyArray<ValueLabel<T>>
  ) {
  }

  private _terminator$: Subject<any> = new Subject();
  private _searchValue$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  get searchValue(): string {
    return this._searchValue$.value;
  }

  set searchValue(value: string) {
    if (value === this.searchValue) {
      return;
    }
    this._searchValue$.next(value);
  }

  private _showAll$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  get showAll(): boolean {
    return this._showAll$.value;
  }

  set showAll(value: boolean) {
    if (value === this.showAll) {
      return;
    }
    this._showAll$.next(value);
  }

  readonly items$: Observable<ReadonlyArray<ValueLabel<T>>> = combineLatest(
    this._searchValue$.pipe(
      throttleTime(100),
      map(search => (search || '').toLowerCase().trim()),
      distinctUntilChanged()
    ),
    this._showAll$
  ).pipe(
    map(([searchValue, showAll]) => {
      if (!searchValue) {
        return [...this._allItems];
      }

      if (showAll) {
        const item = this._allItems.find(x => (x?.label || '').toLowerCase() === searchValue);
        if (item) {
          return [...this._allItems];
        }
      }

      const result = this._allItems.filter(x => (x?.label || '').toLowerCase().includes(searchValue));
      return result;
    }),
    shareReplay(1),
    takeUntil(this._terminator$)
  );

  readonly isPending: boolean = false;

  cleanup(): void {
    this._searchValue$.complete();
    this._terminator$.next();
    this._terminator$.complete();
  }

  getLabelsByValues(...values: ReadonlyArray<T>): Promise<ReadonlyArray<string>> {
    const result = values.map(value => {
      const item = this._allItems.find(x => x.value === value);
      return item?.label || '';
    });
    return Promise.resolve(result);
  }
}
