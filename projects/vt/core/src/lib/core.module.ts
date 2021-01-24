import { NgModule } from '@angular/core';
import { CoreComponent } from './core.component';
import {TranslationsModule} from './modules/translations/translations.module';
import {CdkTableModule} from '@angular/cdk/table';
import { PaginationComponent } from './components/pagination/pagination.component';
import {CommonModule} from '@angular/common';
import {FaIconLibrary, FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {fas} from '@fortawesome/free-solid-svg-icons';



@NgModule({
  declarations: [CoreComponent, PaginationComponent],
  imports: [
    TranslationsModule,
    CdkTableModule,
    CommonModule,
    FontAwesomeModule
  ],
  exports: [
    CommonModule,
    CoreComponent,
    TranslationsModule,
    CdkTableModule,
    PaginationComponent,
    FontAwesomeModule
  ]
})
export class CoreModule {
  constructor(iconLib: FaIconLibrary) {
    iconLib.addIconPacks(fas);
  }
}
