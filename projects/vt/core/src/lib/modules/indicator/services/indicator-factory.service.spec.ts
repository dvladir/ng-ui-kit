import { TestBed } from '@angular/core/testing';

import { IndicatorFactoryService } from './indicator-factory.service';
import {IndicatorImpl} from '../shared/indicator-impl';

describe('IndicatorFactoryService', () => {
  let service: IndicatorFactoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IndicatorFactoryService);
  });

  it('create indicator', () => {
    const indicator = service.create();
    expect(indicator).toBeInstanceOf(IndicatorImpl);
  });
});
