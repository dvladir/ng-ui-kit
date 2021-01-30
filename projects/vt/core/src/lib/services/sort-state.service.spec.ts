import { TestBed } from '@angular/core/testing';

import { SortStateService } from './sort-state.service';

describe('SortStateService', () => {
  let service: SortStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SortStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
