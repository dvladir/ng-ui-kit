import { TestBed } from '@angular/core/testing';

import { IndicatorFactoryService } from './indicator-factory.service';

describe('IndicatorFactoryService', () => {
  let service: IndicatorFactoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IndicatorFactoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
