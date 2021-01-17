import {Component, Input} from '@angular/core';
import {SimpleMessage} from '../../shared/simple-message';

@Component({
  selector: 'vtc-caption',
  template: `
    <span [vtcCaption]="value" [view]="view" [pfx]="pfx" [sfx]="sfx">
    </span>
  `
})
export class CaptionComponent {
  @Input() value: string | SimpleMessage = '';
  @Input() view?: string;
  @Input() sfx?: string;
  @Input() pfx?: string;
}
