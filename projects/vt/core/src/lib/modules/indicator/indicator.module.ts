import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {INDICATOR_ICON} from './shared/indicator-icon';
import {IndicatorIconSetupService} from './services/indicator-icon-setup.service';
import { IndicatorComponent } from './components/indicator/indicator.component';



@NgModule({
  declarations: [IndicatorComponent],
  imports: [
    CommonModule
  ],
  exports: [IndicatorComponent],
  providers: [
    {
      provide: INDICATOR_ICON,
      useFactory: (indicatorIconSetup: IndicatorIconSetupService) => indicatorIconSetup.indicatorIcon,
      deps: [IndicatorIconSetupService]
    }
  ]
})
export class IndicatorModule { }
