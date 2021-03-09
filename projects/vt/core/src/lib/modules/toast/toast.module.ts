import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastViewComponent } from './components/toast-view/toast-view.component';
import {TranslationsModule} from '../translations/public-api';



@NgModule({
  declarations: [ToastViewComponent],
  imports: [
    CommonModule,
    TranslationsModule
  ],
  exports: [ToastViewComponent]
})
export class ToastModule { }
