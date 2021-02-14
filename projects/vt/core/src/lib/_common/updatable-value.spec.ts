import { UpdatableValue } from './updatable-value';
import {Injectable} from '@angular/core';
import {TestScheduler} from 'rxjs/testing';
import {TestBed} from '@angular/core/testing';
import {Utils} from '@vt/core';

const a = 'foo';
const b = 'bar';
const c = 'baz';

@Injectable()
class UpdatableValueService extends UpdatableValue<string> {
  protected getDefaultValue(): string {
    return a;
  }
}

describe('UpdatableValue', () => {

  let service: UpdatableValueService;
  let scheduler: TestScheduler;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UpdatableValueService]
    });
    scheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
    service = TestBed.inject(UpdatableValueService);
  });

  it('Value property change', () => {
    expect(service.value).toEqual(a);
    service.value = b;
    expect(service.value).toEqual(b);
    service.value = b;
    expect(service.value).toEqual(b);
  });

  it('value stream change by property', () => {
    scheduler.run(({expectObservable, cold}) => {
      const gen = Utils.itemsIterator(b, c, c);

      cold('-xxx').subscribe(() => {
        service.value = gen.next().value;
      });

      expectObservable(service.value$).toBe('abc', {a, b, c});
    });
  });

  it('Update value wo immediateUpdate', () => {
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
