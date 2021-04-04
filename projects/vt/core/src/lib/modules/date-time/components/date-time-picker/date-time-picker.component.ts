import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import IMask from 'imask';
import {DateFormat} from '../../shared/date-format.enum';
import {format, parse} from 'date-fns';
import MaskedDateOptions = IMask.MaskedDateOptions;

@Component({
  selector: 'vtc-date-time-picker',
  templateUrl: './date-time-picker.component.html',
  styleUrls: ['./date-time-picker.component.scss']
})
export class DateTimePickerComponent implements OnInit, OnDestroy, AfterViewInit {

  constructor() { }

  @ViewChild('inputRef', {static: true})
  private _inputRef?: ElementRef<HTMLInputElement>;

  private _mask?: IMask.InputMask<MaskedDateOptions>;

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this._mask = new IMask.InputMask(this._inputRef!.nativeElement, {
      mask: Date,
      pattern: DateFormat.DATE_TIME_SEC.toString(),
      format: value => {
        return format(value, DateFormat.DATE_TIME_SEC.toString());
      },
      parse: value => {
        return parse(value, DateFormat.DATE_TIME_SEC.toString(), new Date());
      },
      autofix: true,
      lazy: false,
      blocks: {
        yyyy: {
          mask: IMask.MaskedRange,
          from: 1970,
          to: 2130
        },
        MM: {
          mask: IMask.MaskedRange,
          from: 1,
          to: 12
        },
        dd: {
          mask: IMask.MaskedRange,
          from: 1,
          to: 31
        },
        HH: {
          mask: IMask.MaskedRange,
          from: 0,
          to: 23
        },
        mm: {
          mask: IMask.MaskedRange,
          from: 0,
          to: 59
        },
        ss: {
          mask: IMask.MaskedRange,
          from: 0,
          to: 59
        }
      }
    } as MaskedDateOptions);

    this._mask.on('complete', () => {
      console.log(this._mask?.value);
      console.log(this._mask?.mask);
    });
  }

  ngOnDestroy(): void {
    if (this._mask) {
      this._mask.destroy();
    }
  }

}
