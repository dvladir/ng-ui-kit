import {BehaviorSubject, Observable, Subject} from 'rxjs';
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

  readonly items$: Observable<ReadonlyArray<ValueLabel<T>>> = this._searchValue$.pipe(
    throttleTime(100),
    map(search => (search || '').toLowerCase().trim()),
    distinctUntilChanged(),
    map(search => this._allItems.filter(x => {
      if (!search) {
        return true;
      }
      return (x?.label || '').toLowerCase().includes(search);
    })),
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
