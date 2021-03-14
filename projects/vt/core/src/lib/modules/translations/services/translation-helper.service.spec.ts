import {TestBed} from '@angular/core/testing';
import {TranslationHelperService} from './translation-helper.service';
import {TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import {Observable, of} from 'rxjs';
import {DEFAULT_VIEW} from '../shared/default-view';

class MockTranslationLoader implements TranslateLoader {

  private readonly _en = {
    CAPTION: {
      hello: 'Hello world'
    },
    MESSAGE: {
      ok: 'Success message',
      withParam: 'Message with params {{a}} and {{b}}'
    },
    YES_NO: {
      yes: 'Yes',
      no: 'No'
    }
  };

  private readonly _ru = {
    CAPTION: {
      hello: 'Здравствуй мир'
    },
    MESSAGE: {
      ok: 'Все будет хорошо',
      withParam: 'Сообщения с параметрами {{a}} и {{b}}'
    },
    YES_NO: {
      yes: 'Да',
      no: 'Нет'
    }
  };

  getTranslation(lang: string): Observable<any> {

    switch (lang) {
      case 'ru':
        return of(this._ru);
      default:
        return of(this._en);
    }
  }

}

describe('TranslationHelperService', () => {
  let service: TranslationHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot({
        loader: {provide: TranslateLoader, useClass: MockTranslationLoader}
      })],
      providers: [{
        provide: DEFAULT_VIEW,
        useValue: 'CAPTION'
      }]
    });
    const tns: TranslateService = TestBed.inject(TranslateService);
    tns.setDefaultLang('en');
    tns.use('en');
    service = TestBed.inject(TranslationHelperService);
  });

  it('Initial values', () => {
    expect(service).toBeTruthy();
    expect(service.currentLang()).toEqual('en');
  });

  it('en translations', () => {
    const a = service.getTranslation('hello');
    const b = service.getTranslation('ok', 'MESSAGE');
    const c = service.getTranslation({message: 'withParam', view: 'MESSAGE', params: {a: 'AAA', b: {message: 'hello'}}});

    expect(a).toEqual('Hello world');
    expect(b).toEqual('Success message');
    expect(c).toEqual('Message with params AAA and Hello world');
  });

  it('Other translations', (doneFn) => {
    service.languageChange$.subscribe(() => {
      expect(service.currentLang()).toEqual('ru');

      const a = service.getTranslation('hello');
      const b = service.getTranslation('ok', 'MESSAGE');
      const c = service.getTranslation({message: 'withParam', view: 'MESSAGE', params: {a: 'AAA', b: {message: 'hello'}}});

      expect(a).toEqual('Здравствуй мир');
      expect(b).toEqual('Все будет хорошо');
      expect(c).toEqual('Сообщения с параметрами AAA и Здравствуй мир');
      doneFn();
    });
    expect(service.currentLang()).toEqual('en');
    service.changeLang('ru');
  });

  it('Get view', (doneFn) => {

    expect(service.getView('YES_NO')).toEqual({
      yes: 'Yes',
      no: 'No'
    });

    service.languageChange$.subscribe(() => {
      expect(service.getView('YES_NO')).toEqual({
        yes: 'Да',
        no: 'Нет'
      });

      doneFn();
    });

    service.changeLang('ru');
  });

});
