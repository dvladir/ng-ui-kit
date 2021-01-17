import {Directive, ElementRef, Input, Renderer2} from '@angular/core';
import {BaseCaptionDirective} from './base-caption.directive';
import {TranslationHelperService} from '../services/translation-helper.service';
import {SimpleMessage} from '../shared/simple-message';

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

  @Input('vtcTitleCaption') message: string | SimpleMessage = '';

  protected updateText(text: string): void {
    this._renderer.setAttribute(this._elRef.nativeElement, 'title', text);
  }

}
