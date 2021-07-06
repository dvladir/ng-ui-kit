import {Directive, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {TranslationHelperService} from '../services/translation-helper.service';
import {Subscription} from 'rxjs';
import { DvMessage } from '../shared/dv-message';

@Directive({
  selector: '[dvBaseCaption]'
})
export abstract class BaseCaptionDirective implements OnChanges, OnInit, OnDestroy {

  constructor(
    protected _tnsHelper: TranslationHelperService
  ) {
  }

  @Input() message: DvMessage = '';
  @Input() view?: string;
  @Input() sfx?: string;
  @Input() pfx?: string;

  private _s?: Subscription;

  protected abstract updateText(text: string): void;

  private getTranslation(): string {

    let text: string = this._tnsHelper.getTranslation(this.message, this.view);

    if (this.pfx) {
      text = `${this.pfx}${text}`;
    }

    if (this.sfx) {
      text = `${text}${this.sfx}`;
    }

    return text;
  }

  ngOnChanges(changes: SimpleChanges): void {
    const text: string = this.getTranslation();
    this.updateText(text);
  }

  ngOnDestroy(): void {
    if (this._s) {
      this._s.unsubscribe();
    }
  }

  ngOnInit(): void {
    this._s = this._tnsHelper.languageChange$.subscribe(() => {
      const text: string = this.getTranslation();
      this.updateText(text);
    });
  }

}
