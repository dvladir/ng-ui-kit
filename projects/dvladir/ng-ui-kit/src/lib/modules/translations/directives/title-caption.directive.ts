import {Directive, ElementRef, Input, Renderer2} from '@angular/core';
import {BaseCaptionDirective} from './base-caption.directive';
import {TranslationHelperService} from '../services/translation-helper.service';
import { DvMessage } from '../shared/dv-message';

@Directive({
  selector: '[dvTitleCaption]'
})
export class TitleCaptionDirective extends BaseCaptionDirective {

  constructor(
    tnsHelper: TranslationHelperService,
    private _elRef: ElementRef,
    private _renderer: Renderer2
  ) {
    super(tnsHelper);
  }

  @Input('dvTitleCaption') message: DvMessage = '';

  protected updateText(text: string): void {
    this._renderer.setAttribute(this._elRef.nativeElement, 'title', text);
  }

}
