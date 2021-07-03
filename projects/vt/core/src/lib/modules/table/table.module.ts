import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CdkExportModule} from '../cdk-export/cdk-export.module';
import {PaginationComponent} from './components/pagination/pagination.component';
import {SortableComponent} from './components/sortable/sortable.component';
import {TableComponent} from './components/table/table.component';
import {IndicatorModule} from '../indicator/public-api';
import {TranslationsModule} from '../translations/translations.module';

@NgModule({
  declarations: [
    PaginationComponent,
    SortableComponent,
    TableComponent
  ],
    imports: [
        CommonModule,
        CdkExportModule,
        IndicatorModule,
        TranslationsModule
    ],
  exports: [
    PaginationComponent,
    SortableComponent,
    TableComponent
  ]
})
export class TableModule { }
