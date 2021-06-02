import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ValueLabel} from '../../../../_common/value-label';
import {SimpleTime} from '../../shared/simple-time';

const VALUES: ReadonlyArray<ValueLabel<number>> = new Array(60)
  .fill(0)
  .map((_, value) => {
    let label = value.toString();
    label = label.length === 1 ? `0${value}` : label;
    return {value, label};
  });

const isSimpleTimeEqual = (a: SimpleTime, b: SimpleTime): boolean => {
  if (a === b) {
    return true;
  }

  if (!a && b || a && !b) {
    return false;
  }

  const result = a.hour === b.hour && a.minute === b.minute && a.second === b.second;
  return result;
};

const EMPTY_SIMPLE_TIME: SimpleTime = {hour: 0, minute: 0, second: 0};

@Component({
  selector: 'vtc-time',
  templateUrl: './time.component.html',
  styleUrls: ['./time.component.scss']
})
export class TimeComponent {

  private _simpleTime: SimpleTime = {...EMPTY_SIMPLE_TIME};

  get simpleTime(): SimpleTime {
    return this._simpleTime;
  }

  @Input() set simpleTime(value: SimpleTime) {
    if (isSimpleTimeEqual(this._simpleTime, value)) {
      return;
    }
    this._simpleTime = value || {...EMPTY_SIMPLE_TIME};
    this.setTimeValues();
  }

  @Output() simpleTimeChange: EventEmitter<SimpleTime> = new EventEmitter<SimpleTime>();
  @Output() timePicked: EventEmitter<unknown> = new EventEmitter<unknown>();

  readonly listHours: ReadonlyArray<ValueLabel<number>> = VALUES.slice(0, 24);
  readonly listMinutes: ReadonlyArray<ValueLabel<number>> = VALUES.slice();
  readonly listSeconds: ReadonlyArray<ValueLabel<number>> = VALUES.slice();

  hour: ValueLabel<number> = this.listHours[0];
  minute: ValueLabel<number> = this.listMinutes[0];
  second: ValueLabel<number> = this.listSeconds[0];

  private setTimeValues(): void {
    const {hour, minute, second} = this._simpleTime;
    this.hour = this.listHours.find(x => x.value === hour) || this.listHours[0];
    this.minute = this.listMinutes.find(x => x.value === minute) || this.listMinutes[0];
    this.second = this.listSeconds.find(x => x.value === second) || this.listSeconds[0];
  }

  private changeSimpleTime(simpleTime: Partial<SimpleTime>): void {
    const hourChange = simpleTime.hour !== undefined && simpleTime.hour !== this._simpleTime.hour;
    const minuteChange = simpleTime.minute !== undefined && simpleTime.minute !== this._simpleTime.minute;
    const secondChange = simpleTime.second !== undefined && simpleTime.second !== this._simpleTime.second;
    if (!hourChange && !minuteChange && !secondChange) {
      return;
    }
    this._simpleTime = {...this._simpleTime, ...simpleTime};
    this.simpleTimeChange.emit(this._simpleTime);
  }

  onHourChange(hourValue: ValueLabel<number>): void {
    if (this.hour === hourValue) {
      return;
    }
    this.hour = hourValue;
    this.changeSimpleTime({hour: hourValue.value});
  }

  onMinuteChange(minuteValue: ValueLabel<number>): void {
    if (this.minute === minuteValue) {
      return;
    }
    this.minute = minuteValue;
    this.changeSimpleTime({minute: minuteValue.value});
  }

  onSecondChange(secondValue: ValueLabel<number>): void {
    if (this.second === secondValue) {
      return;
    }
    this.second = secondValue;
    this.changeSimpleTime({second: secondValue.value});
  }

  onItemSelected(): void {
    this.timePicked.emit();
  }

}
