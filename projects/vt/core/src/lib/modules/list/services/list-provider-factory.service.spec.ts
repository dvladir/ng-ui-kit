import { TestBed } from '@angular/core/testing';
import { ListProviderFactoryService } from './list-provider-factory.service';
import {EmptyListProvider} from './list-providers/empty-list-provider';
import {FixedListProvider} from './list-providers/fixed-list-provider';
import {MockAsyncDataSource} from './list-providers/mock-async-data-source';
import {AsyncListProvider} from './list-providers/async-list-provider';
import {TranslationHelperService} from '../../translations/public-api';
import {MockTnsHelper} from '../../translations/services/mock-tns-helper';

describe('ListProviderFactoryService', () => {
  let service: ListProviderFactoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: TranslationHelperService,
          useClass: MockTnsHelper
        }
      ]
    });
    service = TestBed.inject(ListProviderFactoryService);
  });

  it('no source', () => {
    const listProvider = service.create();
    expect(listProvider).toBeInstanceOf(EmptyListProvider);
  });

  it('array', () => {
    const listProvider = service.create([1, 2, 3]);
    expect(listProvider).toBeInstanceOf(FixedListProvider);
  });

  it('async', () => {
    const listProvider = service.create(new MockAsyncDataSource());
    expect(listProvider).toBeInstanceOf(AsyncListProvider);
  });

  it('translate', () => {
    const listProvider = service.create('MESSAGE');
    expect(listProvider).toBeInstanceOf(FixedListProvider);
  });
});
