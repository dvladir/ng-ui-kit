import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { ErrorSourceDirective } from './directives/error-source.directive';
import { ErrorDescriptionComponent } from './components/error-description/error-description.component';
import {TranslationsModule} from '../translations/translations.module';

@NgModule({
  declarations: [
    ErrorSourceDirective,
    ErrorDescriptionComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslationsModule
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    ErrorSourceDirective,
    ErrorDescriptionComponent
  ]
})
export class FormExtModule { }
