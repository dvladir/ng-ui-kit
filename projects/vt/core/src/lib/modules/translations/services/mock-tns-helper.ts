import {SimpleMessage} from '../shared/simple-message';
import {OnDestroy} from '@angular/core';
import {Subject} from 'rxjs';

export class MockTnsHelper implements OnDestroy {

  d: {[key: string]: string} = {
    'CAPTION.hello': 'Hello world',
    'MESSAGE.ok': 'Ok message',
    'TEST.test': 'Test test test'
  };

  readonly languageChange$: Subject<unknown> = new Subject<unknown>();

  getTranslation(message: string | SimpleMessage, view?: string): string {

    if (!message) {
      return '';
    }

    if (typeof message === 'string') {
      return this.getTranslation({message, view});
    }

    if (!message.view) {
      (message as {view: string}).view = 'CAPTION';
    }

    const key = `${message.view}.${message.message}`;
    return this.d[key];
  }

  ngOnDestroy(): void {
    this.languageChange$.complete();
  }
}
