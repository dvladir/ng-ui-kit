import {Component, Input} from '@angular/core';
import { DvMessage } from '../../shared/dv-message';

@Component({
  selector: 'dv-caption',
  template: `
    <span [dvCaption]="value" [view]="view" [pfx]="pfx" [sfx]="sfx">
    </span>
  `
})
export class CaptionComponent {
  @Input() value: DvMessage = '';
  @Input() view?: string;
  @Input() sfx?: string;
  @Input() pfx?: string;
}
