import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule} from '@angular/forms';
import {CdkExportModule} from '../cdk-export/cdk-export.module';
import {TranslationsModule} from '../translations/translations.module';
import { ComboboxComponent } from './components/combobox/combobox.component';
import { DropdownComponent } from './components/dropdown/dropdown.component';


@NgModule({
  declarations: [ComboboxComponent, DropdownComponent],
  imports: [
    CommonModule,
    FormsModule,
    CdkExportModule,
    TranslationsModule
  ],
  exports: [ComboboxComponent]
})
export class ComboboxModule { }
