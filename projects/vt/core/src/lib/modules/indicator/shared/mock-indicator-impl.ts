import {Indicator} from '@vt/core';
import {IsInProgress} from './indicator-impl';

export class MockIndicatorImpl implements Indicator {

  readonly isInProgress: boolean = false;

  hide(): void {
    (this as IsInProgress).isInProgress = false;
  }

  show(): void {
    (this as IsInProgress).isInProgress = true;
  }

}
