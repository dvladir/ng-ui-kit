import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {CdkTableModule} from '@angular/cdk/table';
import {CdkExportModule} from './modules/cdk-export/cdk-export.module';
import {TranslationsModule} from './modules/translations/translations.module';
import {TableModule} from './modules/table/table.module';
import {ModalModule} from './modules/modal/modal.module';
import {ToastModule} from './modules/toast/toast.module';
import {ComboboxModule} from './modules/combobox/combobox.module';
import {IndicatorModule} from './modules/indicator/indicator.module';

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
    ComboboxModule,
    IndicatorModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    TranslationsModule,
    CdkExportModule,
    ModalModule,
    TableModule,
    ToastModule,
    ComboboxModule,
    IndicatorModule
  ]
})
export class CoreModule {
}
