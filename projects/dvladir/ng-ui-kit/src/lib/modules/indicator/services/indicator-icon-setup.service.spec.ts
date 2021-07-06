import { TestBed } from '@angular/core/testing';

import { IndicatorIconSetupService } from './indicator-icon-setup.service';

describe('IndicatorIconSetupService', () => {
  let service: IndicatorIconSetupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IndicatorIconSetupService);
  });

  it('Change icon', () => {
    expect(service.indicatorIcon).toEqual('fa-dharmachakra');
    service.setup('fa-spinner');
    expect(service.indicatorIcon).toEqual('fa-spinner');
  });
});
