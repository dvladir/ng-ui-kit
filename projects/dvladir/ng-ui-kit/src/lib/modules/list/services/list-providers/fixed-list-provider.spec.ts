import {TestScheduler} from 'rxjs/testing';
import {ValueLabel} from '../../../../_common/value-label';
import { FixedListProvider } from './fixed-list-provider';

const ALL_ITEMS: ReadonlyArray<ValueLabel<number>> = [
  {value: 1, label: 'One'},
  {value: 2, label: 'Two'},
  {value: 3, label: 'Three'},
  {value: 4, label: 'Four'},
  {value: 5, label: 'Five'},
];

describe('FixedListProvider', () => {

  let listProvider: FixedListProvider<number>;
  let scheduler: TestScheduler;

  beforeEach(() => {
    listProvider = new FixedListProvider<number>(ALL_ITEMS);
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

      expectObservable(listProvider.items$).toBe('a 100ms b 100ms c 100ms - 100ms d', {
        a: ALL_ITEMS,
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
