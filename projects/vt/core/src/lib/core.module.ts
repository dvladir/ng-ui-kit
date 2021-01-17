import { NgModule } from '@angular/core';
import { CoreComponent } from './core.component';
import {TranslationsModule} from './modules/translations/translations.module';



@NgModule({
  declarations: [CoreComponent],
  imports: [
    TranslationsModule
  ],
  exports: [
    CoreComponent,
    TranslationsModule
  ]
})
export class CoreModule { }
