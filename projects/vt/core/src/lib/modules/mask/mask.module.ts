import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule} from '@angular/forms';
import { PhoneMaskDirective } from './directives/phone-mask.directive';
import { NumberMaskDirective } from './directives/number-mask.directive';
import { EmailMaskDirective } from './directives/email-mask.directive';



@NgModule({
  declarations: [
    PhoneMaskDirective,
    NumberMaskDirective,
    EmailMaskDirective
  ],
  exports: [
    PhoneMaskDirective,
    NumberMaskDirective,
    EmailMaskDirective
  ],
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class MaskModule { }
