import { NgModule } from '@angular/core';
import {CdkTableModule} from '@angular/cdk/table';
import {CommonModule} from '@angular/common';
import {CdkExportModule} from './modules/cdk-export/cdk-export.module';
import {TranslationsModule} from './modules/translations/translations.module';
import {TableModule} from './modules/table/table.module';
import {ModalModule} from './modules/modal/modal.module';
import {ToastModule} from './modules/toast/toast.module';

@NgModule({
  declarations: [],
  imports: [
    TranslationsModule,
    CdkTableModule,
    CommonModule,
    ModalModule,
    TableModule,
    ToastModule
  ],
  exports: [
    CommonModule,
    TranslationsModule,
    CdkExportModule,
    ModalModule,
    TableModule,
    ToastModule
  ]
})
export class CoreModule {
}
