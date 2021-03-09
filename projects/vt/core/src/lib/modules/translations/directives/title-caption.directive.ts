import {Directive, ElementRef, Input, Renderer2} from '@angular/core';
import {BaseCaptionDirective} from './base-caption.directive';
import {TranslationHelperService} from '../services/translation-helper.service';
import { VtMessage } from '../shared/vt-message';

@Directive({
  selector: '[vtcTitleCaption]'
})
export class TitleCaptionDirective extends BaseCaptionDirective {

  constructor(
    tnsHelper: TranslationHelperService,
    private _elRef: ElementRef,
    private _renderer: Renderer2
  ) {
    super(tnsHelper);
  }

  @Input('vtcTitleCaption') message: VtMessage = '';

  protected updateText(text: string): void {
    this._renderer.setAttribute(this._elRef.nativeElement, 'title', text);
  }

}
