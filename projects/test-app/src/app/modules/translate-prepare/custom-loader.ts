import {TranslateLoader} from '@ngx-translate/core';
import {Observable, of} from 'rxjs';
import * as en from './en.json';
import * as ru from './ru.json';

export class CustomLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<any> {

    let d: any;

    switch (lang) {
      case 'ru':
        d = ru;
        break;
      default:
        d = en;
        break;
    }

    return of(d.default);
  }
}
