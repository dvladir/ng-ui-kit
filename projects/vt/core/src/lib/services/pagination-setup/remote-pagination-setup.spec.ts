import {RemotePaginationConfig, RemotePaginationSetup} from './remote-pagination-setup';
import {TestScheduler} from 'rxjs/testing';
import {BehaviorSubject, Observable, of, Subject} from 'rxjs';
import {PaginationData, Sort, SortField} from '@vt/core';

describe('RemotePaginationSetup', () => {

  let scheduler: TestScheduler;
  let sbj$: Subject<{ pageSize: number, currentPage: number, sort: SortField}>;
  let remotePagination: RemotePaginationSetup<{foo: string}>;

  beforeEach(() => {
    scheduler = new TestScheduler(((actual, expected) => expect(expected).toEqual(actual)));
    sbj$ = new Subject<{pageSize: number; currentPage: number; sort: SortField}>();

    const conf: RemotePaginationConfig<{ foo: string }> = {
      getData(pageSize: number, currentPage: number, sort: SortField): Observable<PaginationData<{ foo: string }>> {
        sbj$.next({pageSize, currentPage, sort});
        return of({
          elements: [],
          sort,
          currentPage,
          totalPages: 0,
          totalElements: 0,
          pageSize
        });
      }
    };

    remotePagination = new RemotePaginationSetup<{foo: string}>(conf);

  });

  afterEach(() => {
    if (sbj$) {
      sbj$.complete();
    }
  });

  it('Remote invocations', () => {
    scheduler.run(({expectObservable, cold}) => {
      const refresh$ =     cold('x------x');
      const currentPage$ = cold('abc-----', {a: 0, b: 1, c: 2});
      const pageSize$ =    cold('a--bc---', {a: 10, b: 2, c: 12});
      const sort$ =        cold('a----bc-', {
        a: {sort: Sort.none, field: ''} as SortField,
        b: {sort: Sort.asc, field: 'foo'} as SortField,
        c: {sort: Sort.desc, field: 'foo'} as SortField
      });

      remotePagination.setup(refresh$, pageSize$, currentPage$, sort$).subscribe();

      expectObservable(sbj$).toBe('-bcdefgg', {
        b: {pageSize: 10, currentPage: 1, sort: {sort: Sort.none, field: ''}},
        c: {pageSize: 10, currentPage: 2, sort: {sort: Sort.none, field: ''}},
        d: {pageSize: 2, currentPage: 2, sort: {sort: Sort.none, field: ''}},
        e: {pageSize: 12, currentPage: 2, sort: {sort: Sort.none, field: ''}},
        f: {pageSize: 12, currentPage: 2, sort: {sort: Sort.asc, field: 'foo'}},
        g: {pageSize: 12, currentPage: 2, sort: {sort: Sort.desc, field: 'foo'}}
      });

    });
  });

});
