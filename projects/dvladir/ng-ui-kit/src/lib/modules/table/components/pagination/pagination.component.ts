import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {BehaviorSubject, combineLatest, Observable, Subject} from 'rxjs';
import {map, shareReplay, takeUntil} from 'rxjs/operators';
import {PageSateService} from '../../services/page-sate.service';

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
  selector: 'dv-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
  providers: [
    PageSateService
  ]
})
export class PaginationComponent implements OnInit, OnDestroy {

  constructor(
    private _state: PageSateService
  ) {
    this._state.isImmediateUpdate = true;
  }

  private _terminator$: Subject<unknown> = new Subject<unknown>();

  get isImmediateUpdate(): boolean {
    return this._state.isImmediateUpdate;
  }

  private _disabled$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  get disabled(): boolean {
    return this._disabled$.value;
  }

  @Input() set disabled(value: boolean) {
    if (value === this.disabled) {
      return;
    }
    this._disabled$.next(value);
  }

  @Input() set isCurrentPageAutoUpdate(value: boolean) {
    this._state.isImmediateUpdate = value;
  }

  private _count$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  get count(): number {
    return this._count$.value;
  }

  @Input() set count(value: number){
    if (value === this.count) {
      return;
    }
    this._count$.next(value);
  }

  get current(): number {
    return this._state.value || 0;
  }

  @Input() set current(value: number) {
    this._state.value = value;
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

  private _paginationInfo$: Observable<PaginationInfo> = combineLatest(this._allIndexes$, this._state.value$, this._limit$)
    .pipe(
      map(([numbers, current, limit]) => {
        if (numbers.length <= limit) {
          return { indexesToDisplay: numbers };
        }
        current = current || 0;
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

  readonly pages$: Observable<ReadonlyArray<PageBtnInfo>> = combineLatest(this._paginationInfo$, this._state.value$)
    .pipe(
      map(([{indexesToDisplay}, current]) => {

        const result: PageBtnInfo[] = indexesToDisplay.map(index => ({
          index,
          isActive: index === (current || 0),
          displayValue: index + 1
        }));

        return result;

      })
    );

  readonly isCanNext$: Observable<boolean> = combineLatest(this._disabled$, this._count$, this._state.value$)
    .pipe(
      map(([disabled, count, current]) => this.isCanNext(disabled, count, current || 0))
    );

  readonly isCanPrev$: Observable<boolean> = combineLatest(this._disabled$, this._count$, this._state.value$)
    .pipe(
      map(([disabled, count, current]) => this.isCanPrev(disabled, count, current || 0))
    );

  private isCanNext(disabled: boolean, count: number, current: number): boolean {
    return !disabled && count > 0 && current < count - 1;
  }

  private isCanPrev(disabled: boolean, count: number, current: number): boolean {
    return !disabled && count > 0 && current > 0;
  }

  goToPage(index: number): void {
    if (this.disabled) {
      return;
    }
    this._state.update(index);
  }

  goFirst(): void {
    if (!this.isCanPrev(this.disabled, this.count, this.current)) {
      return;
    }
    this.goToPage(0);
  }

  goLast(): void {
    if (!this.isCanNext(this.disabled, this.count, this.current)) {
      return;
    }
    this.goToPage(this.count - 1);
  }

  goPrevious(): void {
    if (!this.isCanPrev(this.disabled, this.count, this.current)) {
      return;
    }
    this.goToPage(this.current - 1);
  }

  goNext(): void {
    if (!this.isCanNext(this.disabled, this.count, this.current)) {
      return;
    }
    this.goToPage(this.current + 1);
  }

  ngOnInit(): void {
    this._state.valueChange$
      .pipe(
        takeUntil(this._terminator$)
      )
      .subscribe(x => this.currentChange.emit(x));
  }

  ngOnDestroy(): void {
    this._count$.complete();
    this._limit$.complete();
    this._terminator$.next();
    this._terminator$.complete();
  }

}
