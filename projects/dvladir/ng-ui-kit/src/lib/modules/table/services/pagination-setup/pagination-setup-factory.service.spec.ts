import { TestBed } from '@angular/core/testing';

import {PaginationConfig, PaginationSetupFactoryService} from './pagination-setup-factory.service';
import {Observable, of} from 'rxjs';
import {LocalPaginationSetup, LocalPaginationConfig} from './local-pagination-setup';
import {PaginationSetup} from './pagination-setup';
import {RemotePaginationSetup, RemotePaginationConfig} from './remote-pagination-setup';
import {PaginationData} from '../../shared/pagination-data';
import {SortField} from '../../shared/sort-field';

interface Item {
  strField: string;
  numField: number;
}

describe('PaginationSetupService', () => {
  let service: PaginationSetupFactoryService;

  const localPaginationConfig: LocalPaginationConfig<Item> = {
    source$: of<ReadonlyArray<Item>>([{numField: 1, strField: 'a'}, {numField: 2, strField: 'b'}]),
    sortPredicates: {
      numField: (a, b) => a.numField - b.numField,
      strField: (a, b) => a.strField.localeCompare(b.strField)
    }
  };

  const remotePaginationConfig: RemotePaginationConfig<Item> = {
    getData(pageSize: number, currentPage: number, sort: SortField): Observable<PaginationData<Item>> {
      return of({
        pageSize: 0,
        totalElements: 0,
        totalPages: 0,
        currentPage,
        sort,
        elements: []
      });
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PaginationSetupFactoryService]
    });
    service = TestBed.inject(PaginationSetupFactoryService);
    spyOn(service, 'create').and.callThrough();
  });

  it('Create local pagination configurer', () => {
    let paginationSetup: PaginationSetup<Item> | undefined;
    expect(() => {
      paginationSetup = service.create(localPaginationConfig);
    }).not.toThrow();
    expect(paginationSetup).toBeDefined();
    expect(paginationSetup).toBeInstanceOf(LocalPaginationSetup);
  });

  it('Create remote pagination configurer', () => {
    let paginationSetup: PaginationSetup<Item> | undefined;
    expect(() => {
      paginationSetup = service.create(remotePaginationConfig);
    }).not.toThrow();
    expect(paginationSetup).toBeDefined();
    expect(paginationSetup).toBeInstanceOf(RemotePaginationSetup);
  });

  it('Attempt to create with invalid config', () => {
    let paginationSetup: PaginationSetup<Item> | undefined;
    expect(() => {
      paginationSetup = service.create({} as any as PaginationConfig<Item>);
    }).toThrow();
    expect(paginationSetup).not.toBeDefined();
  });
});
