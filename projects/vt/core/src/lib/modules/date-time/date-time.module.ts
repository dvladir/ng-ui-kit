import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CdkExportModule} from '../cdk-export/cdk-export.module';
import { TimeComponent } from './components/time/time.component';
import { StepperComponent } from './components/stepper/stepper.component';
import {ListModule} from './../list/public-api';
import { CalendarComponent } from './components/calendar/calendar.component';
import {TranslationsModule} from '../translations/translations.module';
import { PickerComponent } from './components/picker/picker.component';
import { DateTimePickerComponent } from './components/date-time-picker/date-time-picker.component';

@NgModule({
  declarations: [
    TimeComponent,
    StepperComponent,
    CalendarComponent,
    PickerComponent,
    DateTimePickerComponent
  ],
    imports: [
        CommonModule,
        ListModule,
        CdkExportModule,
        TranslationsModule
    ],
  exports: [
    TimeComponent,
    CalendarComponent,
    PickerComponent,
    DateTimePickerComponent
  ]
})
export class DateTimeModule { }
