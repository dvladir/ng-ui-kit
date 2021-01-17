import {Directive, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {TranslationHelperService} from '../services/translation-helper.service';
import {SimpleMessage} from '../shared/simple-message';
import {Subscription} from 'rxjs';

@Directive({
  selector: '[vtcBaseCaption]'
})
export abstract class BaseCaptionDirective implements OnChanges, OnInit, OnDestroy {

  constructor(
    protected _tnsHelper: TranslationHelperService
  ) {
  }

  @Input() message: string | SimpleMessage = '';
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
