import {Directive, ElementRef, Input, Renderer2} from '@angular/core';
import {TranslationHelperService} from '../services/translation-helper.service';
import {SimpleMessage} from '../shared/simple-message';
import {BaseCaptionDirective} from './base-caption.directive';

@Directive({
  selector: '[vtcPlaceholderCaption]'
})
export class PlaceholderCaptionDirective extends BaseCaptionDirective {

  constructor(
    tnsHelper: TranslationHelperService,
    private _elRef: ElementRef,
    private _renderer: Renderer2
  ) {
    super(tnsHelper);
  }

  @Input('vtcPlaceholderCaption') message: string | SimpleMessage = '';

  protected updateText(text: string): void {
    this._renderer.setAttribute(this._elRef.nativeElement, 'placeholder', text);
  }

}
