import { NgModule } from '@angular/core';
import { CoreComponent } from './core.component';
import {TranslationsModule} from './modules/translations/translations.module';
import {CdkTableModule} from '@angular/cdk/table';
import { PaginationComponent } from './components/pagination/pagination.component';
import {CommonModule} from '@angular/common';
import { TableComponent } from './components/table/table.component';
import { SortableComponent } from './components/sortable/sortable.component';

@NgModule({
  declarations: [CoreComponent, PaginationComponent, TableComponent, SortableComponent],
  imports: [
    TranslationsModule,
    CdkTableModule,
    CommonModule
  ],
  exports: [
    CommonModule,
    CoreComponent,
    TranslationsModule,
    CdkTableModule,
    PaginationComponent,
    TableComponent,
    SortableComponent
  ]
})
export class CoreModule {
}
