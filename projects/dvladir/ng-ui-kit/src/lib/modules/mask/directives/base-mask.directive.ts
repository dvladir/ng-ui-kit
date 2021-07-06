import {AfterViewInit, Directive, ElementRef, HostListener, OnChanges, OnDestroy, Renderer2, SimpleChanges} from '@angular/core';
import {ControlValueAccessor} from '@angular/forms';
import {noop} from 'rxjs';
import IMask from 'imask';

@Directive({
  selector: '[vtcBaseMask]'
})
export abstract class BaseMaskDirective<T> implements AfterViewInit, OnChanges, OnDestroy, ControlValueAccessor {

  protected constructor(
    protected _inputRef: ElementRef<HTMLInputElement>,
    protected _r: Renderer2
  ) {
  }

  protected _mask?: IMask.InputMask<IMask.AnyMaskedOptions>;

  protected _onValueChange: (value: any) => void = noop;
  private _initialValue: unknown = undefined;

  protected abstract createMaskOptions(value?: T): IMask.AnyMaskedOptions | undefined;
  protected abstract get optionsName(): string;

  private setupMask(opts?: T): void {
    if (this._mask) {
      this._mask.destroy();
    }
    const options = this.createMaskOptions(opts);
    if (!options) {
      return;
    }
    this._mask = new IMask.InputMask(this._inputRef!.nativeElement, options);
    if (this._initialValue) {
      this._mask.unmaskedValue = this._initialValue as string;
      this._initialValue = undefined;
    }
  }

  protected abstract updateValueInternal(): void;

  private updateValue(): void {
    setTimeout(() => {
      this.updateValueInternal();
    }, 100);
  }

  @HostListener('blur')
  onBlur(): void {
    this.updateValue();
  }

  @HostListener('keydown.enter')
  onEnter(): void {
    this.updateValue();
  }

  ngAfterViewInit(): void {
    if (!this._mask) {
      this.setupMask();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    const opts = changes[this.optionsName];
    if (opts && opts.currentValue !== opts.previousValue) {
      this.setupMask(opts.currentValue);
    }
  }

  ngOnDestroy(): void {
    this._onValueChange = noop;
    if (this._mask) {
      this._mask.destroy();
    }
  }

  registerOnChange(fn: any): void {
    this._onValueChange = fn;
  }

  registerOnTouched(fn: any): void {
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this._r.setAttribute(this._inputRef!.nativeElement, 'disabled', 'disabled');
    } else {
      this._r.removeAttribute(this._inputRef!.nativeElement, 'disabled');
    }
  }

  writeValue(obj: any): void {
    if (this._mask) {
      this._mask!.unmaskedValue = (obj || '').toString();
    } else {
      this._initialValue = (obj || '').toString();
    }
  }

}
