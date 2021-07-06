import { IndicatorImpl } from './indicator-impl';
import {fakeAsync, tick} from '@angular/core/testing';

describe('IndicatorImpl', () => {

  let indicator: IndicatorImpl;

  const getTimerId = (): number => (indicator as any)._timerId;

  beforeEach(() => {
    indicator = new IndicatorImpl();
  });

  it('Show', fakeAsync(() => {
    expect(indicator.isInProgress).toBeFalse();
    expect(getTimerId()).toBeUndefined();
    indicator.show();
    const timerId = getTimerId();
    expect(timerId).toBeDefined();
    tick(100);
    expect(indicator.isInProgress).toBeFalse();
    indicator.show();
    expect(getTimerId()).toEqual(timerId);
    tick(800);
    expect(indicator.isInProgress).toBeTrue();
    expect(getTimerId()).toBeUndefined();

    indicator.show();
    tick(100);
    expect(indicator.isInProgress).toBeTrue();
    expect(getTimerId()).toBeUndefined();
  }));

  it('Immediate hide', fakeAsync(() => {
    expect(indicator.isInProgress).toBeFalse();
    expect(getTimerId()).toBeUndefined();
    indicator.show();
    expect(getTimerId).toBeDefined();
    tick(100);
    expect(indicator.isInProgress).toBeFalse();
    expect(getTimerId).toBeDefined();
    indicator.hide();
    expect(getTimerId()).toBeUndefined();
    tick(800);
    expect(indicator.isInProgress).toBeFalse();
    expect(getTimerId()).toBeUndefined();
  }));

  it('Show / Hide', fakeAsync(() => {
    expect(indicator.isInProgress).toBeFalse();
    indicator.show();
    tick(900);
    expect(indicator.isInProgress).toBeTrue();
    indicator.hide();
    expect(indicator.isInProgress).toBeFalse();
  }));

});
