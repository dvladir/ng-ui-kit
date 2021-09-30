import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {CdkTableModule} from '@angular/cdk/table';
import {CdkExportModule} from './modules/cdk-export/cdk-export.module';
import {TranslationsModule} from './modules/translations/translations.module';
import {TableModule} from './modules/table/table.module';
import {ModalModule} from './modules/modal/modal.module';
import {ToastModule} from './modules/toast/toast.module';
import {ListModule} from './modules/list/list.module';
import {IndicatorModule} from './modules/indicator/indicator.module';
import {DateTimeModule} from './modules/date-time/date-time.module';
import {MaskModule} from './modules/mask/mask.module';
import { FormExtModule } from './modules/form-ext/form-ext.module';
import {PhoneInputModule} from './modules/phone-input/public-api';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    TranslationsModule,
    CdkTableModule,
    ModalModule,
    TableModule,
    ToastModule,
    ListModule,
    IndicatorModule,
    DateTimeModule,
    MaskModule,
    FormExtModule,
    PhoneInputModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    TranslationsModule,
    CdkExportModule,
    ModalModule,
    TableModule,
    ToastModule,
    ListModule,
    IndicatorModule,
    DateTimeModule,
    MaskModule,
    FormExtModule,
    PhoneInputModule
  ]
})
export class CoreModule {
}
