import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {endOfMonth, startOfMonth, isEqual, endOfWeek, startOfWeek, eachDayOfInterval, getMonth, addMonths, isSameDay} from 'date-fns';
import {BehaviorSubject, combineLatest, Observable, of} from 'rxjs';
import {distinctUntilChanged, filter, map} from 'rxjs/operators';

export interface CalendarDate {
  date: Date;
  displayValue: string;
  isDisabled?: boolean;
  isSelected?: boolean;
  isOtherMonth: boolean;
}

@Component({
  selector: 'vtc-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit, OnDestroy {

  private _date$: BehaviorSubject<Date> = new BehaviorSubject<Date>(new Date());

  get date(): Date {
    return this._date$.value;
  }

  @Input() set date(value: Date) {
    if (value === this.date) {
      return;
    }
    this._date$.next(value);
  }

  @Output() dateChange: EventEmitter<Date> = new EventEmitter<Date>();

  private _startOfMonth$: BehaviorSubject<Date> = new BehaviorSubject<Date>(startOfMonth(this.date));

  readonly month$: Observable<string> = this._startOfMonth$.pipe(
    map(x => getMonth(x)),
    map(x => `month_${x}`)
  );

  readonly year$: Observable<any> = this._startOfMonth$.pipe(
    map(x => x.getFullYear())
  );

  dates$: Observable<CalendarDate[][]> = of([]);

  nextMonth(): void {
    const nextMonth = addMonths(this._startOfMonth$.value, 1);
    this._startOfMonth$.next(nextMonth);
  }

  previousMonth(): void {
    const previousMonth = addMonths(this._startOfMonth$.value, -1);
    this._startOfMonth$.next(previousMonth);
  }

  pickDay(day: CalendarDate): void {
    if (day.isDisabled) {
      return;
    }
    const {date} = day;
    this.date = date;
    this.dateChange.emit(date);
  }

  ngOnInit(): void {

    this._date$
      .pipe(
        filter(x => !!x),
        distinctUntilChanged((a, b) => isEqual(a, b)),
        map(x => startOfMonth(x))
      )
      .subscribe(firstDate => this._startOfMonth$.next(firstDate));

    const startOfMonth$ = this._startOfMonth$.pipe(
      distinctUntilChanged((a, b) => isEqual(a, b))
    );

    this.dates$ = combineLatest(startOfMonth$, this._date$)
      .pipe(
        map(([firstDate, selectedDate]) => {
          const month = getMonth(firstDate);
          const lastDate = endOfMonth(firstDate);
          const start = startOfWeek(firstDate, {weekStartsOn: 1});
          const end = endOfWeek(lastDate, {weekStartsOn: 1});
          const datesInterval = eachDayOfInterval({start, end});

          const result: CalendarDate[][] = datesInterval.reduce((res, date, i) => {

            let week = res[res.length - 1];
            if (!week || week.length === 7) {
              week = [];
              res.push(week);
            }

            const isOtherMonth = date.getMonth() !== month;
            const isSelected = isSameDay(date, selectedDate);

            let displayValue = `${date.getDate()}`;
            displayValue = displayValue.length === 1 ? `0${displayValue}` : displayValue;

            week.push({
              date,
              displayValue,
              isSelected,
              isOtherMonth
            });

            return res;
          }, [] as CalendarDate[][]);
          return result;
        })
      );
  }

  ngOnDestroy(): void {
    this._startOfMonth$.complete();
    this._date$.complete();
  }

}
