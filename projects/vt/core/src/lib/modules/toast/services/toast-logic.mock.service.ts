import {Message} from '@vt/core';
import {BehaviorSubject} from 'rxjs';
import {OnDestroy} from '@angular/core';

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
