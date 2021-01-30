import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {BehaviorSubject, combineLatest, Observable, Subject} from 'rxjs';
import {map, shareReplay, takeUntil} from 'rxjs/operators';

export interface PageBtnInfo {
  readonly index: number;
  readonly isActive: boolean;
  readonly displayValue: number;
}

export interface PaginationInfo {
  readonly indexesToDisplay: ReadonlyArray<number>;
  readonly isLeftOffset?: boolean;
  readonly isRightOffset?: boolean;
}

@Component({
  selector: 'vtc-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit, OnDestroy {

  private _terminator$: Subject<unknown> = new Subject<unknown>();

  private _count$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  get count(): number {
    return this._count$.value;
  }

  @Input() isCurrentPageAutoUpdate: boolean = true;

  @Input() set count(value: number){
    if (value === this.count) {
      return;
    }
    this._count$.next(value);
  }

  private _current$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  get current(): number {
    return this._current$.value;
  }

  @Input() set current(value: number) {
    if (value === this.current) {
      return;
    }
    this._current$.next(value);
  }

  @Output() currentChange: EventEmitter<number> = new EventEmitter<number>();

  private _limit$: BehaviorSubject<number> = new BehaviorSubject<number>(5);

  get limit(): number {
    return this._limit$.value;
  }

  @Input() set limit(value: number) {
    if (value === this.limit) {
      return;
    }
    this._limit$.next(value);
  }

  private _allIndexes$: Observable<ReadonlyArray<number>> = this._count$.pipe(
    map(count => (new Array(count)).fill(0).map((_, i) => i)),
    shareReplay(1),
    takeUntil(this._terminator$)
  );

  private _paginationInfo$: Observable<PaginationInfo> = combineLatest(this._allIndexes$, this._current$, this._limit$)
    .pipe(
      map(([numbers, current, limit]) => {
        if (numbers.length <= limit) {
          return { indexesToDisplay: numbers };
        }

        const count = numbers.length;

        const leftOffset = Math.floor(limit / 2);
        const rightOffset = Math.ceil(limit / 2);

        let start = current - leftOffset;
        let end = current + rightOffset;

        if (start < 0) {
          const edge = 0;
          const diff = start - edge;
          start = edge;
          end -= diff;
        }

        if (end > count) {
          const edge = count;
          const diff = end - edge;
          end = edge;
          start -= diff;
        }

        const isLeftOffset = start > 0;
        const isRightOffset = end < count;

        const indexesToDisplay = numbers.slice(start, end);
        return {indexesToDisplay, isLeftOffset, isRightOffset};
      })
    );

  readonly isLeftOffset$: Observable<boolean> = this._paginationInfo$.pipe(map(({isLeftOffset}) => !!isLeftOffset));
  readonly isRightOffset$: Observable<boolean> = this._paginationInfo$.pipe(map(({isRightOffset}) => !!isRightOffset));

  readonly pages$: Observable<ReadonlyArray<PageBtnInfo>> = combineLatest(this._paginationInfo$, this._current$)
    .pipe(
      map(([{indexesToDisplay}, current]) => {

        const result: PageBtnInfo[] = indexesToDisplay.map(index => ({
          index,
          isActive: index === current,
          displayValue: index + 1
        }));

        return result;

      })
    );

  readonly isCanNext$: Observable<boolean> = combineLatest(this._count$, this._current$)
    .pipe(
      map(([count, current]) => this.isCanNext(count, current))
    );

  readonly isCanPrev$: Observable<boolean> = combineLatest(this._count$, this._current$)
    .pipe(
      map(([count, current]) => this.isCanPrev(count, current))
    );

  private isCanNext(count: number, current: number): boolean {
    return count > 0 && current < count - 1;
  }

  private isCanPrev(count: number, current: number): boolean {
    return count > 0 && current > 0;
  }

  goToPage(index: number): void {
    if (index === this.current) {
      return;
    }
    if (this.isCurrentPageAutoUpdate) {
      this.current = index;
    }
    this.currentChange.emit(index);
  }

  goFirst(): void {
    if (!this.isCanPrev(this.count, this.current)) {
      return;
    }
    this.goToPage(0);
  }

  goLast(): void {
    if (!this.isCanNext(this.count, this.current)) {
      return;
    }
    this.goToPage(this.count - 1);
  }

  goPrevious(): void {
    if (!this.isCanPrev(this.count, this.current)) {
      return;
    }
    this.goToPage(this.current - 1);
  }

  goNext(): void {
    if (!this.isCanNext(this.count, this.current)) {
      return;
    }
    this.goToPage(this.current + 1);
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this._count$.complete();
    this._current$.complete();
    this._limit$.complete();
    this._terminator$.next();
    this._terminator$.complete();
  }

}
