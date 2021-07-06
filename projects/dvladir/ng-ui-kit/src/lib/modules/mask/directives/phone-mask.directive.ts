import {Directive, ElementRef, forwardRef, Host, Input, Renderer2} from '@angular/core';
import {BaseMaskDirective} from './base-mask.directive';
import {NG_VALUE_ACCESSOR} from '@angular/forms';
import IMask from 'imask';

@Directive({
  selector: 'input[dvPhone]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PhoneMaskDirective),
      multi: true
    }
  ]
})
export class PhoneMaskDirective extends BaseMaskDirective<string> {

  constructor(
    @Host() _inputRef: ElementRef<HTMLInputElement>,
    _r: Renderer2
  ) {
    super(_inputRef, _r);
  }

  @Input('dvPhone') phoneMask?: string;

  protected createMaskOptions(value?: string): IMask.AnyMaskedOptions | undefined {
    if (!value) {
      return undefined;
    }
    return {
      mask: value,
      lazy: false
    };
  }

  protected get optionsName(): string {
    return 'phoneMask';
  }

  protected updateValueInternal(): void {
    const opts = this._mask?.masked;
    let valueForUpdate = this._mask!.unmaskedValue || '';
    const placeHolder = (opts as any).placeholderChar;
    if (this._mask!.value.includes(placeHolder)) {
      valueForUpdate = '';
      this._mask!.unmaskedValue = '';
    }
    this._onValueChange(valueForUpdate);
  }

}
