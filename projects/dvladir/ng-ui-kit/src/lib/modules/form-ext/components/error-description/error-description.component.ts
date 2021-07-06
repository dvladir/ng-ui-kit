import {Component, Inject, Input, Optional} from '@angular/core';
import { DEFAULT_ERROR_VIEW } from '../../shared/default-error-view';
import { ErrorSourceDirective } from '../../directives/error-source.directive';

@Component({
  selector: 'dv-error-description',
  templateUrl: './error-description.component.html',
  styleUrls: ['./error-description.component.scss']
})
export class ErrorDescriptionComponent {
  constructor(
    @Optional() @Inject(DEFAULT_ERROR_VIEW) private _defaultErrorView?: string
  ) {
  }
  @Input() view?: string = this._defaultErrorView;
  @Input() errorSrc?: ErrorSourceDirective;

}
