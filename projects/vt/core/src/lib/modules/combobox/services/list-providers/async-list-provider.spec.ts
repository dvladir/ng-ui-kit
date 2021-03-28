import {TestScheduler} from 'rxjs/testing';
import {AsyncListProvider} from './async-list-provider';
import {MockAsyncDataSource, MockKeyValuePair} from './mock-async-data-source';
import {MockIndicatorImpl} from '../../../indicator/public-api';


describe('AsyncListProvider', () => {

  const indicator = new MockIndicatorImpl();
  let listProvider: AsyncListProvider<number, MockKeyValuePair>;
  let scheduler: TestScheduler;

  beforeEach(() => {
    indicator.hide();
    const ds = new MockAsyncDataSource();
    listProvider = new AsyncListProvider(ds, indicator);
    scheduler = new TestScheduler(((actual, expected) => expect(expected).toEqual(actual)));
  });

  afterEach(() => {
    listProvider.cleanup();
  });

  it('Search items', () => {

    scheduler.run(({expectObservable, cold}) => {

      cold('- 100ms x 100ms y 100ms y 100ms z', {
        x: 'f',
        y: 'fi',
        z: 'fix'
      }).subscribe(value => {
        listProvider.searchValue = value;
      });

      expectObservable(listProvider.items$).toBe('- 100ms b 100ms c 100ms - 100ms d', {
        b: [{value: 4, label: 'Four'}, {value: 5, label: 'Five'}],
        c: [{value: 5, label: 'Five'}],
        d: []
      });

    });
  });

  it('Get labels by values', async (done) => {
    const result = await listProvider.getLabelsByValues(3, 4, 6);
    expect(result).toEqual(['Three', 'Four', '']);
    done();
  });

});
