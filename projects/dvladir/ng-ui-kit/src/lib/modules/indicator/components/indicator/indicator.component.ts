import {Component, Inject, Input, OnChanges, SimpleChanges} from '@angular/core';
import {INDICATOR_ICON} from '../../shared/indicator-icon';

@Component({
  selector: 'vtc-indicator',
  templateUrl: './indicator.component.html'
})
export class IndicatorComponent implements OnChanges {

  constructor(
    @Inject(INDICATOR_ICON) private _icon: string
  ) {
  }

  @Input() classes?: string;

  appliedClasses: string[] = [this._icon];

  ngOnChanges(changes: SimpleChanges): void {
    const chClasses = changes.classes;
    if (chClasses?.currentValue !== chClasses?.previousValue) {
      const v = (chClasses.currentValue || '').split(' ');
      this.appliedClasses = [this._icon, ...v];
    }
  }

}
