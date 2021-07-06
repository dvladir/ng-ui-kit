import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CdkExportModule} from '../cdk-export/cdk-export.module';
import { ModalHeaderComponent } from './components/modal-header/modal-header.component';
import { ModalFooterComponent } from './components/modal-footer/modal-footer.component';
import { ModalBodyComponent } from './components/modal-body/modal-body.component';
import { ModalDialogComponent } from './components/modal-dialog/modal-dialog.component';
import {TranslationsModule} from '../translations/translations.module';
import { MultiChoiceModalComponent } from './components/multi-choice-modal/multi-choice-modal.component';



@NgModule({
  declarations: [ModalHeaderComponent, ModalFooterComponent, ModalBodyComponent, ModalDialogComponent, MultiChoiceModalComponent],
  imports: [
    CommonModule,
    CdkExportModule,
    TranslationsModule
  ],
  exports: [ModalHeaderComponent, ModalFooterComponent, ModalBodyComponent, ModalDialogComponent, MultiChoiceModalComponent]
})
export class ModalModule { }
