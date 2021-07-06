import {TestBed} from '@angular/core/testing';

import {ToastLogicService} from './toast-logic.service';
import {TestScheduler} from 'rxjs/testing';
import {Utils} from '../../../_common/utils';
import {Message} from '../shared/message';
import {MessageType} from '../shared/message-type.enum';

describe('ToastLogicService', () => {
  let service: ToastLogicService;
  let scheduler: TestScheduler;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    scheduler = new TestScheduler((actual, expected) => expect(expected).toEqual(actual));
    service = TestBed.inject(ToastLogicService);
  });

  it('Show / hide message', () => {
    scheduler.run(({expectObservable, cold}) => {
      const message1: Message = {text: 'foo', messageType: MessageType.info};
      const message2: Message = {text: 'bar', messageType: MessageType.err};

      cold('-x').subscribe(() => service.addMessage(message1, 50));
      cold('---x').subscribe(() => service.addMessage(message2, 50));
      cold('-----x').subscribe(() => service.removeMessage(message1));

      expectObservable(service.messages$).toBe('-b-c-d', {
        b: [message1],
        c: [message1, message2],
        d: [message2],
      });
    });
  });

  it('Remove all messages', () => {
    scheduler.run(({expectObservable, cold}) => {
      const message1: Message = {text: 'foo', messageType: MessageType.info};
      const message2: Message = {text: 'bar', messageType: MessageType.err};

      cold('-x').subscribe(() => service.addMessage(message1, 50));
      cold('---x').subscribe(() => service.addMessage(message2, 50));
      cold('-----x').subscribe(() => service.removeAll());

      expectObservable(service.messages$).toBe('-b-c-d', {
        b: [message1],
        c: [message1, message2],
        d: [],
      });
    });
  });

  it('Messages limit', () => {
    scheduler.run(({expectObservable, cold}) => {
      const m1: Message = {text: 'm1', messageType: MessageType.info};
      const m2: Message = {text: 'm2', messageType: MessageType.err};
      const m3: Message = {text: 'm3', messageType: MessageType.info};
      const m4: Message = {text: 'm4', messageType: MessageType.warn};
      const m5: Message = {text: 'm5', messageType: MessageType.info};
      const m6: Message = {text: 'm6', messageType: MessageType.ok};
      const m7: Message = {text: 'm7', messageType: MessageType.ok};

      const g = Utils.itemsIterator(m1, m2, m3, m4, m5, m6, m7);
      cold('-abcdxyz').subscribe(() => service.addMessage(g.next().value, 50));

      expectObservable(service.messages$).toBe('-abcdxyz', {
        a: [m1],
        b: [m1, m2],
        c: [m1, m2, m3],
        d: [m1, m2, m3, m4],
        x: [m1, m2, m3, m4, m5],
        y: [m1, m2, m3, m4, m5, m6],
        z: [m2, m3, m4, m5, m6, m7]
      });
    });
  });




});
