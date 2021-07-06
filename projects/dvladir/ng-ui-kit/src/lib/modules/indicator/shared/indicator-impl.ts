import {Indicator} from './indicator';

export interface IsInProgress {
  isInProgress: boolean;
}

export class IndicatorImpl implements Indicator {

  constructor(
    private _timeoutAmount: number = 800
  ) {
  }

  private _timerId?: number;

  readonly isInProgress: boolean = false;

  private innerHide(): void {
    (this as IsInProgress).isInProgress = false;
  }

  private innerShow(): void {
    (this as IsInProgress).isInProgress = true;
  }

  hide(): void {
    if (!!this._timerId) {
      clearTimeout(this._timerId);
      this._timerId = undefined;
    }
    this.innerHide();
  }

  show(): void {
    if (this.isInProgress || !!this._timerId) {
      return;
    }

    this._timerId = setTimeout(() => {
      this._timerId = undefined;
      this.innerShow();
    }, this._timeoutAmount);
  }
}
