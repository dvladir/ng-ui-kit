import {Component, forwardRef, Input, OnChanges, OnDestroy, SimpleChanges} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {DateFormat} from '../../shared/date-format.enum';
import {ParseDateStrategy} from '../../shared/parse-date/parse-date-strategy';
import {ParseDateStrategyTime} from '../../shared/parse-date/parse-date-strategy-time';
import {ParseDateStrategySimple} from '../../shared/parse-date/parse-date-strategy-simple';
import {noop} from 'rxjs';
import {format, isValid, parse} from 'date-fns';

@Component({
  selector: 'vtc-date-time-picker',
  templateUrl: './date-time-picker.component.html',
  styleUrls: ['./date-time-picker.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateTimePickerComponent),
      multi: true
    }
  ]
})
export class DateTimePickerComponent implements OnChanges, ControlValueAccessor, OnDestroy {

  @Input() withTime: boolean = true;
  @Input() vtcTabIndex?: number;

  private _onChange: (value?: string) => void = noop;

  dateFormat: DateFormat = DateFormat.DATE_TIME_FULL;
  strategy: ParseDateStrategy = new ParseDateStrategyTime();

  private _date: Date = new Date(NaN);

  get date(): Date {
    return this._date;
  }

  set date(value: Date) {
    if (value === this._date) {
      return;
    }
    this._date = value;
    let dateString = '';
    if (isValid(value)) {
      dateString = format(value, this.dateFormat);
    }
    this._onChange(dateString);
  }

  isDisabled: boolean = false;

  isOpen: boolean = false;


  toggleCalendar(): void {
    this.isOpen = !this.isOpen;
  }

  closeCalendar(): void {
    this.isOpen = false;
  }

  ngOnChanges(changes: SimpleChanges): void {
    const withTime = changes.withTime;
    if (withTime.currentValue !== withTime.previousValue) {
      const isWithTime = !!withTime.currentValue;
      this.dateFormat = isWithTime ? DateFormat.DATE_TIME_FULL : DateFormat.DATE;
      this.strategy = isWithTime ? new ParseDateStrategyTime() : new ParseDateStrategySimple();
    }
  }

  registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: any): void {
  }

  writeValue(value: string): void {
    const v = parse(value, this.dateFormat, new Date());
    this._date = v;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  ngOnDestroy(): void {
    this._onChange = noop;
  }

}
