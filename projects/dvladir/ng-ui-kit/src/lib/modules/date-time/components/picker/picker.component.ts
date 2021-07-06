import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {SimpleTime} from '../../shared/simple-time';
import {isValid} from 'date-fns';

@Component({
  selector: 'vtc-picker',
  templateUrl: './picker.component.html',
  styleUrls: ['./picker.component.scss']
})
export class PickerComponent implements OnChanges {

  @Input() date: Date = new Date();
  @Input() withTime: boolean = true;

  @Output() dateChange: EventEmitter<Date> = new EventEmitter<Date>();
  @Output() datePicked: EventEmitter<unknown> = new EventEmitter<unknown>();

  time: SimpleTime = this.getTime(this.date);

  private getTime(date?: Date): SimpleTime {
    const hour = date ? date.getHours() : 0;
    const minute = date ? date.getMinutes() : 0;
    const second = date ? date.getSeconds() : 0;
    return {hour, minute, second};
  }

  handleDateChange(dateValue: Date): void {
    const date = new Date(dateValue);
    date.setHours(this.time.hour, this.time.minute, this.time.second);
    this.dateChange.emit(date);
  }

  handleTimeChange(timeValue: SimpleTime): void {
    this.time = {...timeValue};
    const date = new Date(this.date);
    date.setHours(this.time.hour, this.time.minute, this.time.second);
    this.dateChange.emit(date);
  }

  handleDatePicked(): void {
    this.datePicked.emit();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const date = changes.date;
    if (date.currentValue !== date.previousValue) {
      const d = isValid(date.currentValue) ? date.currentValue : undefined;
      this.time = this.getTime(d);
    }
  }


}
