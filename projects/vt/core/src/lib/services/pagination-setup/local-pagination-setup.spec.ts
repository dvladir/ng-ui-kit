import {LocalPaginationConfig, LocalPaginationSetup} from './local-pagination-setup';
import {of} from 'rxjs';
import {TestScheduler} from 'rxjs/testing';
import {PaginationData, Sort, SortField} from '@vt/core';

interface Item {
  strField: string;
  numField: number;
}

const ITEMS: Item[] = [
  {strField: 'aaa', numField: 10},
  {strField: 'bbb', numField: 9},
  {strField: 'ccc', numField: 8},
  {strField: 'ddd', numField: 7},
  {strField: 'eee', numField: 6},
  {strField: 'fff', numField: 5},
  {strField: 'ggg', numField: 4},
  {strField: 'jjj', numField: 3},
  {strField: 'kkk', numField: 2},
  {strField: 'iii', numField: 1},
  {strField: 'xxx', numField: 0},
];

describe('LocalPaginationSetup', () => {

  let scheduler: TestScheduler;
  let pagination: LocalPaginationSetup<Item>;

  beforeEach(() => {
    scheduler = new TestScheduler(((actual, expected) => expect(expected).toEqual(actual)));
    const conf: LocalPaginationConfig<Item> = {
      source$: of(ITEMS),
      sortPredicates: {
        strField: (a, b) => a.strField.localeCompare(b.strField),
        numField: (a, b) => a.numField - b.numField
      }
    };
    pagination = new LocalPaginationSetup<Item>(conf);
  });

  it('Page change', () => {
    scheduler.run(({expectObservable, cold}) => {
      const pagesizeS = cold('x', {x: 5});
      const refresh$ = cold('x');
      const currentPage$ = cold('xy', {x: 0, y: 1});
      const sort$ = cold('x', {x: {field: '', sort: Sort.none} as SortField});

      const result$ = pagination.setup(refresh$, pagesizeS, currentPage$, sort$);

      const a: PaginationData<Item> = {
        sort: {field: '', sort: Sort.none},
        pageSize: 5,
        totalElements: ITEMS.length,
        totalPages: 3,
        currentPage: 0,
        elements: ITEMS.slice(0, 5)
      };

      const b: PaginationData<Item> = {
        sort: {field: '', sort: Sort.none},
        pageSize: 5,
        totalElements: ITEMS.length,
        totalPages: 3,
        currentPage: 1,
        elements: ITEMS.slice(5, 10)
      };

      expectObservable(result$).toBe('ab', {a, b});
    });
  });

  it('Page size change', () => {
    scheduler.run(({expectObservable, cold}) => {
      const pagesizeS = cold('xy', {x: 5, y: 6});
      const refresh$ = cold('x');
      const currentPage$ = cold('x', {x: 0});
      const sort$ = cold('x', {x: {field: '', sort: Sort.none} as SortField});

      const result$ = pagination.setup(refresh$, pagesizeS, currentPage$, sort$);

      const a: PaginationData<Item> = {
        sort: {field: '', sort: Sort.none},
        pageSize: 5,
        totalElements: ITEMS.length,
        totalPages: 3,
        currentPage: 0,
        elements: ITEMS.slice(0, 5)
      };

      const b: PaginationData<Item> = {
        sort: {field: '', sort: Sort.none},
        pageSize: 6,
        totalElements: ITEMS.length,
        totalPages: 2,
        currentPage: 0,
        elements: ITEMS.slice(0, 6)
      };

      expectObservable(result$).toBe('ab', {a, b});
    });
  });

  it('Sort change', () => {
    scheduler.run(({expectObservable, cold}) => {
      const pagesizeS = cold('x', {x: 5});
      const refresh$ = cold('x');
      const currentPage$ = cold('x', {x: 0});


      const sortX: SortField = {field: '', sort: Sort.none};
      const sortY: SortField = {field: 'strField', sort: Sort.asc};
      const sortZ: SortField = {field: 'strField', sort: Sort.desc};
      const sortA: SortField = {field: 'numField', sort: Sort.asc};
      const sortB: SortField = {field: 'numField', sort: Sort.desc};

      const sort$ = cold('xyzab', {
        x: sortX,
        y: sortY,
        z: sortZ,
        a: sortA,
        b: sortB
      });

      const result$ = pagination.setup(refresh$, pagesizeS, currentPage$, sort$);

      const createPageItem = ({sort, elements}: {sort: SortField, elements: Item[]}) => ({
        pageSize: 5,
        totalElements: ITEMS.length,
        totalPages: 3,
        currentPage: 0,
        sort,
        elements
      });

      const x: PaginationData<Item> = createPageItem({
        sort: sortX,
        elements: [...ITEMS].slice(0, 5)
      });
      const y: PaginationData<Item> = createPageItem({
        sort: sortY,
        elements: [...ITEMS].sort((x1, x2) => x1.strField.localeCompare(x2.strField)).slice(0, 5)
      });
      const z: PaginationData<Item> = createPageItem({
        sort: sortZ,
        elements: [...ITEMS].sort((x1, x2) => x1.strField.localeCompare(x2.strField) * -1).slice(0, 5)
      });
      const a: PaginationData<Item> = createPageItem({
        sort: sortA,
        elements: [...ITEMS].sort((x1, x2) => x1.numField - x2.numField).slice(0, 5)
      });
      const b: PaginationData<Item> = createPageItem({
        sort: sortB,
        elements: [...ITEMS].sort((x1, x2) => x2.numField - x1.numField).slice(0, 5)
      });

      expectObservable(result$).toBe('xyzab', {x, y, z, a, b});
    });
  });

  it('Refresh', () => {
    scheduler.run(({expectObservable, cold}) => {
      const pagesizeS = cold('x', {x: 5});
      const refresh$ = cold('xx');
      const currentPage$ = cold('x', {x: 0});
      const sort$ = cold('x', {x: {field: '', sort: Sort.none} as SortField});

      const result$ = pagination.setup(refresh$, pagesizeS, currentPage$, sort$);

      const a: PaginationData<Item> = {
        sort: {field: '', sort: Sort.none},
        pageSize: 5,
        totalElements: ITEMS.length,
        totalPages: 3,
        currentPage: 0,
        elements: ITEMS.slice(0, 5)
      };

      expectObservable(result$).toBe('aa', {a});
    });
  });
});
