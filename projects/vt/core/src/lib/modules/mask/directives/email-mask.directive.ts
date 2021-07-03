import {Directive, ElementRef, forwardRef, Host, Renderer2} from '@angular/core';
import {BaseMaskDirective} from './base-mask.directive';
import {NG_VALUE_ACCESSOR} from '@angular/forms';
import IMask from 'imask';

const WHOLE_EMAIL_CHECK: RegExp = /^[A-Za-z0-9_\.-]+@[A-Za-z0-9-]+\.[A-Za-z]+$/;

@Directive({
  selector: '[vtcEmail]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => EmailMaskDirective),
      multi: true
    }
  ]
})
export class EmailMaskDirective extends BaseMaskDirective<unknown>{

  constructor(
    @Host() _inputRef: ElementRef<HTMLInputElement>,
    _r: Renderer2
  ) {
    super(_inputRef, _r);
  }

  protected createMaskOptions(value: unknown | undefined): IMask.AnyMaskedOptions | undefined {
    const result: IMask.MaskedPatternOptions = {
      mask: 'N{@}D{.}Z',
      blocks: {
        N: {
          mask: /^[A-Za-z0-9_\.-]+$/,
        },
        D: {
          mask: /^[A-Za-z0-9-]+$/
        },
        Z: {
          mask: /^[A-Za-z]{1,4}$/
        }
      }
    };
    return result;
  }

  protected get optionsName(): string {
    return 'none';
  }

  protected updateValueInternal(): void {
    let valueForUpdate = this._mask!.value || '';
    if (!WHOLE_EMAIL_CHECK.test(valueForUpdate)) {
      valueForUpdate = '';
      this._mask!.unmaskedValue = '';
    }
    this._onValueChange(valueForUpdate);
  }

}
