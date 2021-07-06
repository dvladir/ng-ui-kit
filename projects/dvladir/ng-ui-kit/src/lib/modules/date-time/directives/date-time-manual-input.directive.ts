import {
  Directive,
  ElementRef,
  EventEmitter,
  Host,
  HostBinding,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges
} from '@angular/core';
import IMask from 'imask';
import MaskedDateOptions = IMask.MaskedDateOptions;
import {DateFormat} from '../shared/date-format.enum';
import {format, parse} from 'date-fns';
import {ParseDateStrategy} from '../shared/parse-date/parse-date-strategy';

@Directive({
  selector: 'input[vtcDateTimeManualInput]'
})
export class DateTimeManualInputDirective implements OnDestroy, OnChanges {

  constructor(
    @Host() private _inputRef: ElementRef<HTMLInputElement>
  ) { }

  private _mask?: IMask.InputMask<MaskedDateOptions>;

  @HostBinding('type') readonly inputType = 'text';


  @Input() dateFormat?: DateFormat;
  @Input() parseStrategy?: ParseDateStrategy;

  @Input('vtcDateTimeManualInput') date?: Date;
  @Output('vtcDateTimeManualInputChange') dateChange: EventEmitter<Date> = new EventEmitter<Date>();

  private setupMask(dateFormat: DateFormat | undefined): void {
    if (this._mask) {
      this._mask.destroy();
    }

    if (!dateFormat) {
      return;
    }

    this._mask = new IMask.InputMask(this._inputRef!.nativeElement, {
      mask: Date,
      pattern: dateFormat.toString(),
      format: value => {
        const res = format(value, dateFormat.toString());
        return res;
      },
      parse: value => {
        const res = parse(value, dateFormat.toString(), new Date());
        return res;
      },
      autofix: true,
      lazy: true,
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

    this._inputRef!.nativeElement.placeholder = this._mask.mask.toString();
  }

  private onValueUpdate(): void {
    const value = this._mask!.value || '';
    const date = !!this.parseStrategy ?
      this.parseStrategy.parse(value) :
      parse(value, this.dateFormat!, new Date());
    this.dateChange.emit(date);
  }

  @HostListener('blur')
  onBlur(): void {
    this.onValueUpdate();
  }

  @HostListener('keydown.enter')
  onEnter(): void {
    this.onValueUpdate();
  }

  ngOnDestroy(): void {
    if (this._mask) {
      this._mask.destroy();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {

    const dateFormatChange = changes.dateFormat;
    if (dateFormatChange && dateFormatChange.currentValue !== dateFormatChange.previousValue) {
      this.setupMask(dateFormatChange.currentValue);
    }

    const dateChange = changes.date;
    if (dateChange && dateChange.currentValue !== dateChange.previousValue) {
      if (this._mask && this.dateFormat) {
        const d: Date = dateChange?.currentValue;
        const isDateValid = !!d && !isNaN(d.getTime());
        const updateValue = !isDateValid ? '' : format(dateChange.currentValue, this.dateFormat);
        this._mask!.value = updateValue;
      }
    }
  }

}
