/*
import {TestBed} from '@angular/core/testing';

import {SortStateService} from './sort-state.service';
import {Sort, SortField, Utils} from '@vt/core';
import {TestScheduler} from 'rxjs/testing';

describe('SortStateService', () => {
  let service: SortStateService;
  let scheduler: TestScheduler;

  const a: SortField = {field: '', sort: Sort.none};
  const b: SortField = {field: 'foo', sort: Sort.asc};
  const c: SortField = {field: 'bar', sort: Sort.desc};


  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SortStateService]
    });
    scheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
    service = TestBed.inject(SortStateService);
  });

  it('Active sort property change', () => {
    expect(service.value).toEqual(a);
    service.value= b;
    expect(service.value).toEqual(b);
    service.value= b;
    expect(service.value).toEqual(b);
  });

  it('Active sort stream change by property', () => {
    scheduler.run(({expectObservable, cold}) => {
      const gen = Utils.itemsIterator(b, c, c);

      cold('-xxx').subscribe(() => {
        service.value= gen.next().value;
      });

      expectObservable(service.value$).toBe('abc', {a, b, c});
    });
  });

  it('Update sort wo immediateUpdate', () => {
    scheduler.run(({expectObservable, cold}) => {
      const gen = Utils.itemsIterator(b, c, c, b, b, c);
      cold('-bccbbc').subscribe(() => service.update(gen.next().value));
      expectObservable(service.value$).toBe('a', {a});
      expectObservable(service.valueChange$).toBe('abccbbc', {a, b, c});
    });
  });

  it('Update sort with immediateUpdate', () => {
    service.isImmediateUpdate = true;
    scheduler.run(({expectObservable, cold}) => {
      const gen = Utils.itemsIterator(b, c, c, b, b, c);
      cold('-bccbbc').subscribe(() => service.update(gen.next().value));
      expectObservable(service.valueChange$).toBe('abccbbc', {a, b, c});
      expectObservable(service.value$).toBe('abc-b-c', {a, b, c});
    });
  });

});
*/
