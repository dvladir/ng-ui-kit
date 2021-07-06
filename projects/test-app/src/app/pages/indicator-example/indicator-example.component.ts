import { Component } from '@angular/core';
import {Indicator, IndicatorFactoryService} from '@dvladir/ng-ui-kit';

@Component({
  selector: 'vta-indicator-example',
  templateUrl: './indicator-example.component.html',
  styleUrls: ['./indicator-example.component.scss']
})
export class IndicatorExampleComponent {

  constructor(
    private _indicatorFactory: IndicatorFactoryService
  ) { }

  readonly indicator: Indicator = this._indicatorFactory.create();

  isShow: boolean = true;

  toggleIndicator(): void {
    this.isShow ?
      this.indicator.show() :
      this.indicator.hide();
    this.isShow = !this.isShow;
  }

}
