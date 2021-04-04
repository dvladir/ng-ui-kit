import {Indicator } from '../shared/indicator';
import {IndicatorFactoryService} from './indicator-factory.service';
import {MockIndicatorImpl} from '../shared/mock-indicator-impl';

export class MockIndicatorFactoryService implements IndicatorFactoryService {

  constructor() { }

  create(timerAmount?: number): Indicator {
    return new MockIndicatorImpl();
  }
}
