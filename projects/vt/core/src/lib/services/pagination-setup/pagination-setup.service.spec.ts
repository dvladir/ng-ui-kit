import { TestBed } from '@angular/core/testing';

import { PaginationSetupService } from './pagination-setup.service';

describe('PaginationSetupService', () => {
  let service: PaginationSetupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaginationSetupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
