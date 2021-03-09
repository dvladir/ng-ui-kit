import {Directive, ElementRef, Input, Renderer2} from '@angular/core';
import {TranslationHelperService} from '../services/translation-helper.service';
import {BaseCaptionDirective} from './base-caption.directive';
import {VtMessage} from '../shared/vt-message';

@Directive({
  selector: '[vtcCaption]'
})
export class CaptionDirective extends BaseCaptionDirective {

  constructor(
    tnsHelper: TranslationHelperService,
    private _elRef: ElementRef,
    private _renderer: Renderer2
  ) {
    super(tnsHelper);
  }

  @Input('vtcCaption') message: VtMessage = '';

  protected updateText(text: string): void {
    this._renderer.setProperty(this._elRef.nativeElement, 'innerHTML', text);
  }

}
