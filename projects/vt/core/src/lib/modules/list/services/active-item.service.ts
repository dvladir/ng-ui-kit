import {ListProvider} from './list-providers/list-provider';
import {BehaviorSubject, combineLatest, Observable, Subject} from 'rxjs';
import {map, takeUntil} from 'rxjs/operators';
import {Injectable, OnDestroy} from '@angular/core';

interface CanPrevNext {
  isCanPrev: boolean;
  isCanNext: boolean;
}

@Injectable()
export class ActiveItemService implements OnDestroy {

  private _itemsLength: number = 0;

  private _terminator$?: Subject<any>;

  private _activeItemIndex$: BehaviorSubject<number> = new BehaviorSubject<number>(-1);

  readonly onActiveItemIndexChange$: Observable<number> = this._activeItemIndex$;

  readonly isCanPrev: boolean = false;
  readonly isCanNext: boolean = false;

  get activeItemIndex(): number {
    return this._activeItemIndex$.value;
  }

  set activeItemIndex(value: number) {
    if (value === this.activeItemIndex) {
      return;
    }
    this._activeItemIndex$.next(value);
    this.updatePrevNext();
  }

  activeValue?: unknown;

  setup(listProvider: ListProvider<unknown>): void {
    this.terminate();
    this._terminator$ = new Subject<any>();

    listProvider.items$
      .pipe(
        takeUntil(this._terminator$)
      )
      .subscribe(items => {
        this._itemsLength = items.length;
        const index = items.findIndex(x => x.value === this.activeValue);
        this.activeItemIndex = index;
      });

    combineLatest(listProvider.items$, this._activeItemIndex$)
      .pipe(
        map(([items, activeIndex]) => items[activeIndex]?.value),
        takeUntil(this._terminator$)
      )
      .subscribe(value => {
        this.activeValue = value;
      });
  }

  private terminate(): void {
    if (this._terminator$) {
      this._terminator$.next();
      this._terminator$.complete();
    }
    this._terminator$ = undefined;
  }

  private updatePrevNext(): void {
    (this as CanPrevNext).isCanPrev = this.activeItemIndex > 0;
    (this as CanPrevNext).isCanNext = this.activeItemIndex < this._itemsLength - 1;
  }

  switchPrev(): void {
    if (!this.isCanPrev) {
      return;
    }
    --this.activeItemIndex;
  }

  switchNext(): void {
    if (!this.isCanNext) {
      return;
    }
    ++this.activeItemIndex;
  }

  ngOnDestroy(): void {
    this.terminate();
    this._activeItemIndex$.complete();
  }

}

