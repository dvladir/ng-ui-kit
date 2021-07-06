import {BehaviorSubject} from 'rxjs';
import {OnDestroy} from '@angular/core';
import {Message} from '../shared/message';

export class ToastLogicMockService implements OnDestroy {
  messages$: BehaviorSubject<Message[]> = new BehaviorSubject<Message[]>([]);

  addMessage(message: Message, ttl?: number): void {
  }

  removeMessage(message: Message): void {
  }

  removeAll(): void {
  }

  ngOnDestroy(): void {
    this.messages$.complete();
  }
}
