import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CdkExportModule} from '../cdk-export/cdk-export.module';
import {MaskModule} from '../mask/mask.module';
import {ListModule} from '../list/list.module';
import { PhoneInputComponent } from './components/phone-input/phone-input.component';
import { Masks2ListItemsPipe } from './pipes/masks2-list-items.pipe';
import {FormsModule} from '@angular/forms';


@NgModule({
  declarations: [
    PhoneInputComponent,
    Masks2ListItemsPipe
  ],
  imports: [
    CommonModule,
    CdkExportModule,
    MaskModule,
    ListModule,
    FormsModule
  ],
  exports: [
    PhoneInputComponent
  ]
})
export class PhoneInputModule {
}
