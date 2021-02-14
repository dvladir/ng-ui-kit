import {OnDestroy} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

export abstract class UpdatableValue<T> implements OnDestroy {

  protected constructor(defaultValue: T) {
    const defValue: T =
      typeof defaultValue === 'object' ?
        {...defaultValue} : defaultValue;

    this._value$ = new BehaviorSubject<T>(defValue);
    this._valueChange$ = new BehaviorSubject<T>(defValue);
  }

  private readonly _value$: BehaviorSubject<T>;
  private readonly _valueChange$: BehaviorSubject<T>;

  get value(): T {
    return this._value$.value;
  }

  set value(v: T) {
    if (v === this.value) {
      return;
    }
    this._value$.next(v);
  }

  get value$(): Observable<T> {
    return this._value$;
  }

  get valueChange$(): Observable<T> {
    return this._valueChange$;
  }

  isImmediateUpdate: boolean = false;

  update(value: T): void {
    this._valueChange$.next(value);
    if (this.isImmediateUpdate) {
      this.value = value;
    }
  }

  ngOnDestroy(): void {
    this._value$.complete();
    this._valueChange$.complete();
  }
}
