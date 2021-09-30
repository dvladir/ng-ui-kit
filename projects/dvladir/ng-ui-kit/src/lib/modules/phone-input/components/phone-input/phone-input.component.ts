import {Component, ElementRef, forwardRef, Input, OnChanges, OnDestroy, SimpleChanges, ViewChild} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {noop} from 'rxjs';
import {PhoneMaskItem} from '../../shared/phone-mask-item';
import {Utils} from '../../../../_common/utils';

@Component({
  selector: 'dv-phone-input',
  templateUrl: './phone-input.component.html',
  styleUrls: ['./phone-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PhoneInputComponent),
      multi: true
    }
  ]
})
export class PhoneInputComponent implements OnChanges, OnDestroy, ControlValueAccessor {

  get inputValue(): string {
    return this._inputValue;
  }

  set inputValue(value: string) {
    if (value === this._inputValue) {
      return;
    }
    this._inputValue = value;
    this.updatePhoneValue();
  }

  get selectedMask(): PhoneMaskItem | undefined {
    return this._selectedMask;
  }

  set selectedMask(value: PhoneMaskItem | undefined) {
    if (value === this._selectedMask) {
      return;
    }
    this._selectedMask = value;
    this.updatePhoneValue();
  }

  private _inputValue: string = '';

  @ViewChild('maskInput', {static: true})
  private _maskInput!: ElementRef;

  private _onChange: (value?: unknown) => void = noop;

  private _phoneValue: string = '';

  private _selectedMask?: PhoneMaskItem = undefined;

  @Input() items: PhoneMaskItem[] = [];
  @Input() dvTabIndex?: number;

  isDisabled: boolean = false;

  private updatePhoneValue(): void {
    const value = `${this._selectedMask?.code || ''}${this._inputValue}`;
    if (value === this._phoneValue) {
      return;
    }
    this._phoneValue = value;
    this._onChange(this._phoneValue);
  }

  private parsePhoneValue(): void {
    if (!this._phoneValue) {
      return;
    }
    const mask = (this.items || []).find(x => this._phoneValue.startsWith(x.code));
    if (!mask) {
      return;
    }
    this._inputValue = this._phoneValue.replace(mask.code, '');
    this._selectedMask = mask;
  }

  onMaskSelect(): void {
    Utils.focusElementRef(this._maskInput);
  }

  registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: any): void {
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  writeValue(obj: string): void {
    this._phoneValue = obj;
    this.parsePhoneValue();
  }

  ngOnDestroy(): void {
    this._onChange = noop;
  }

  ngOnChanges(changes: SimpleChanges): void {
    const cItems = changes.items;
    if (cItems.previousValue !== cItems.currentValue) {
      this.parsePhoneValue();
    }
  }

}
