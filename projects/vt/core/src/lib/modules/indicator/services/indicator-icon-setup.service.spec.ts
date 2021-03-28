import { TestBed } from '@angular/core/testing';

import { IndicatorIconSetupService } from './indicator-icon-setup.service';

describe('IndicatorIconSetupService', () => {
  let service: IndicatorIconSetupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IndicatorIconSetupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
