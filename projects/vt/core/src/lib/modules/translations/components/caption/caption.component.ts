import {Component, Input} from '@angular/core';
import { VtMessage } from '../../shared/vt-message';

@Component({
  selector: 'vtc-caption',
  template: `
    <span [vtcCaption]="value" [view]="view" [pfx]="pfx" [sfx]="sfx">
    </span>
  `
})
export class CaptionComponent {
  @Input() value: VtMessage = '';
  @Input() view?: string;
  @Input() sfx?: string;
  @Input() pfx?: string;
}
