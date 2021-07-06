import {Directive, Host, OnDestroy, OnInit} from '@angular/core';
import {NgControl} from '@angular/forms';
import {Observable, Subject} from 'rxjs';
import {map, startWith, takeUntil} from 'rxjs/operators';
import { API_ERRORS } from '../shared/api-errors';

interface ErrorContainer {
  errors$?: Observable<ReadonlyArray<string>>;
}

@Directive({
  selector: '[dvErrSrc][formControl],[dvErrSrc][formControlName],[dvErrSrc][ngModel]',
  exportAs: 'DvErrSrc'
})
export class ErrorSourceDirective implements OnInit, OnDestroy {

  constructor(
    @Host() private _ctrl: NgControl
  ) { }

  private _terminator$: Subject<unknown> = new Subject<unknown>();

  readonly errors$?: Observable<ReadonlyArray<string>>;

  ngOnInit(): void {
    (this as ErrorContainer).errors$ = this._ctrl.statusChanges!
      .pipe(
        map(() => {
          const errorKey = API_ERRORS as unknown as string;
          const result = this._ctrl.getError(errorKey) as ReadonlyArray<string>;
          return result || [];
        }),
        startWith([]),
        takeUntil(this._terminator$)
      );
  }


  ngOnDestroy(): void {
    this._terminator$.next();
    this._terminator$.complete();
  }

}
