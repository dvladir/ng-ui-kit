import {Indicator, IndicatorFactoryService, MockIndicatorImpl} from '@vt/core';

export class MockIndicatorFactoryService implements IndicatorFactoryService {

  constructor() { }

  create(timerAmount?: number): Indicator {
    return new MockIndicatorImpl();
  }
}
