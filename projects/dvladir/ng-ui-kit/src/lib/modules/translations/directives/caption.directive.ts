import {Directive, ElementRef, Input, Renderer2} from '@angular/core';
import {TranslationHelperService} from '../services/translation-helper.service';
import {BaseCaptionDirective} from './base-caption.directive';
import {DvMessage} from '../shared/dv-message';

@Directive({
  selector: '[dvCaption]'
})
export class CaptionDirective extends BaseCaptionDirective {

  constructor(
    tnsHelper: TranslationHelperService,
    private _elRef: ElementRef,
    private _renderer: Renderer2
  ) {
    super(tnsHelper);
  }

  @Input('dvCaption') message: DvMessage = '';

  protected updateText(text: string): void {
    this._renderer.setProperty(this._elRef.nativeElement, 'innerHTML', text);
  }

}
