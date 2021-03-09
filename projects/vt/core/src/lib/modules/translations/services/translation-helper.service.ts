import {Inject, Injectable, Optional} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {Observable} from 'rxjs';
import {DEFAULT_VIEW} from '../shared/default-view';
import {VtMessage} from '../shared/vt-message';

@Injectable({
  providedIn: 'root'
})
export class TranslationHelperService {

  constructor(
    private _translateService: TranslateService,
    @Optional() @Inject(DEFAULT_VIEW) private _defaultView: string
  ) {
  }

  readonly languageChange$: Observable<unknown> = this._translateService.onLangChange;

  currentLang(): string {
    return this._translateService.currentLang;
  }

  changeLang(lang: string): void {
    this._translateService.use(lang);
  }

  getTranslation(message: VtMessage, view?: string): string {

    if (!message) {
      return '';
    }

    if (typeof message === 'string') {
      return this.getTranslation({message, view});
    }

    if (!message.view && this._defaultView) {
      (message as {view: string}).view = this._defaultView;
    }
    const key: string = !!message?.view ? `${message.view}.${message.message}` : message.message;

    const interpolateParams = !message?.params ? undefined : Object.keys(message.params).reduce((res, paramName) => {
      // tslint:disable-next-line:no-non-null-assertion
      const v = message.params![paramName];
      if (typeof v === 'string' || typeof v === 'number') {
        res[paramName] = v;
      } else {
        res[paramName] = this.getTranslation(v);
      }
      return res;
    }, {} as {[key: string]: string | number});

    return this._translateService.instant(key, interpolateParams);
  }
}
