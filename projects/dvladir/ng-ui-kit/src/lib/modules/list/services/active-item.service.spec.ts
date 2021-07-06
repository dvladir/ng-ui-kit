import {ActiveItemService} from './active-item.service';
import {fakeAsync, TestBed, tick} from '@angular/core/testing';
import {TestScheduler} from 'rxjs/testing';
import {FixedListProvider} from './list-providers/fixed-list-provider';

describe('ActiveItemService', () => {

  let service: ActiveItemService;
  let scheduler: TestScheduler;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ActiveItemService
      ]
    });

    scheduler = new TestScheduler(((actual, expected) => expect(expected).toEqual(actual)));
    service = TestBed.inject(ActiveItemService);
    service.setup(new FixedListProvider([
      {value: 1, label: 'One'},
      {value: 2, label: 'Two'},
      {value: 3, label: 'Three'},
      {value: 4, label: 'Four'},
      {value: 5, label: 'Five'},
    ]));
  });

  it('Active index change', fakeAsync(() => {
    expect(service.activeItemIndex).toEqual(-1);
    expect(service.activeValue).toBeUndefined();

    service.activeItemIndex = 1;
    tick(100);

    expect(service.activeValue).toEqual(2);
  }));

  it('Switch prev', fakeAsync(() => {
    service.activeItemIndex = 2;
    tick(100);
    expect(service.activeValue).toEqual(3);

    service.switchPrev();
    tick(100);
    expect(service.activeItemIndex).toEqual(1);
    expect(service.activeValue).toEqual(2);

    service.switchPrev();
    tick(100);
    expect(service.activeItemIndex).toEqual(0);
    expect(service.activeValue).toEqual(1);

    service.switchPrev();
    tick(100);
    expect(service.activeItemIndex).toEqual(0);
    expect(service.activeValue).toEqual(1);
  }));

  it('Switch next', fakeAsync(() => {
    service.activeItemIndex = 2;
    tick(100);
    expect(service.activeValue).toEqual(3);

    service.switchNext();
    tick(100);
    expect(service.activeItemIndex).toEqual(3);
    expect(service.activeValue).toEqual(4);

    service.switchNext();
    tick(100);
    expect(service.activeItemIndex).toEqual(4);
    expect(service.activeValue).toEqual(5);

    service.switchNext();
    tick(100);
    expect(service.activeItemIndex).toEqual(4);
    expect(service.activeValue).toEqual(5);

  }));

});
