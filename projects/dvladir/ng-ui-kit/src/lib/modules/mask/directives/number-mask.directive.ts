import {Directive, ElementRef, forwardRef, Host, Input, Renderer2} from '@angular/core';
import {BaseMaskDirective} from './base-mask.directive';
import IMask from 'imask';
import {NG_VALUE_ACCESSOR} from '@angular/forms';

export interface MinMax {
  min: number;
  max: number;
}

const DEFAULT_MIN_MAX: MinMax = {min: 1970, max: 2100};

@Directive({
  selector: 'input[vtcNumber]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NumberMaskDirective),
      multi: true
    }
  ]
})
export class NumberMaskDirective extends BaseMaskDirective<MinMax>{

  constructor(
    @Host() _inputRef: ElementRef<HTMLInputElement>,
    _r: Renderer2
  ) {
    super(_inputRef, _r);
  }

  @Input('vtcNumber') numberOptions?: MinMax;

  protected createMaskOptions(value?: MinMax): IMask.AnyMaskedOptions | undefined {
    if (!value) {
      value = DEFAULT_MIN_MAX;
    }
    return {mask: Number, ...value};
  }

  protected get optionsName(): string {
    return 'numberOptions';
  }

  protected updateValueInternal(): void {
    const valueForUpdateStr = this._mask?.unmaskedValue || '';
    if (valueForUpdateStr === '') {
      this._onValueChange(undefined);
      return;
    }
    let valueForUpdate = parseFloat(this._mask!.unmaskedValue || '');
    valueForUpdate = isNaN(valueForUpdate) ? (this.numberOptions?.min || DEFAULT_MIN_MAX.min) : valueForUpdate;
    this._onValueChange(valueForUpdate);
  }

}
