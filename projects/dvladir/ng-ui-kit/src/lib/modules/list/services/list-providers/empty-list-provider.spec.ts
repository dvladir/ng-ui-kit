import { EmptyListProvider } from './empty-list-provider';
import {TestScheduler} from 'rxjs/testing';

describe('EmptyListProvider', () => {

  let listProvider: EmptyListProvider;
  let scheduler: TestScheduler;

  beforeEach(() => {
    listProvider = new EmptyListProvider();
    scheduler = new TestScheduler(((actual, expected) => expect(expected).toEqual(actual)));
  });

  it('Search Items', () => {
    scheduler.run(({expectObservable, cold}) => {

      cold('- 100ms x 100ms y 100ms y 100ms z', {
        x: 'f',
        y: 'fi',
        z: 'fix'
      }).subscribe(value => {
        listProvider.searchValue = value;
      });

      expectObservable(listProvider.items$).toBe('(a|)', {
        a: []
      });
    });
  });

  it('Get labels by values', async (done) => {
    const result = await listProvider.getLabelsByValues(3, 4, 6);
    expect(result).toEqual([]);
    done();
  });
});
