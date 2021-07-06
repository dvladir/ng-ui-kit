import {Injectable, OnDestroy} from '@angular/core';
import {Subject} from 'rxjs';
import {DvMessage} from '../shared/dv-message';

@Injectable()
export class MockTnsHelper implements OnDestroy {

  d: {[key: string]: string} = {
    'CAPTION.hello': 'Hello world',
    'MESSAGE.ok': 'Ok message',
    'TEST.test': 'Test test test'
  };

  readonly languageChange$: Subject<unknown> = new Subject<unknown>();

  getTranslation(message: DvMessage, view?: string): string {

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

  getView(view: string): {[key: string]: string} {
    return {foo: 'Foo'};
  }

  ngOnDestroy(): void {
    this.languageChange$.complete();
  }
}
