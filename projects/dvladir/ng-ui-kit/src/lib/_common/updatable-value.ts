import {BehaviorSubject, Observable} from 'rxjs';
import {Injectable, OnDestroy} from '@angular/core';

@Injectable()
export abstract class UpdatableValue<T> implements OnDestroy {

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

  private readonly _value$: BehaviorSubject<T> = new BehaviorSubject<T>(this.getDefaultValue());
  private readonly _valueChange$: BehaviorSubject<T> = new BehaviorSubject<T>(this.getDefaultValue());

  isImmediateUpdate: boolean = false;

  protected abstract getDefaultValue(): T;

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
