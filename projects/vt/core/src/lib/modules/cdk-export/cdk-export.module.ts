import { NgModule } from '@angular/core';
import {CdkTableModule} from '@angular/cdk/table';
import {OverlayModule} from '@angular/cdk/overlay';

@NgModule({
  exports: [
    CdkTableModule,
    OverlayModule
  ]
})
export class CdkExportModule { }
