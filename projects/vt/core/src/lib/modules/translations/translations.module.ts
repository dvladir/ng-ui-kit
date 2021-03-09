import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {TitleCaptionDirective} from './directives/title-caption.directive';
import {PlaceholderCaptionDirective} from './directives/placeholder-caption.directive';
import { CaptionDirective } from './directives/caption.directive';
import { CaptionComponent } from './components/caption/caption.component';

@NgModule({
  declarations: [TitleCaptionDirective, PlaceholderCaptionDirective, CaptionDirective, CaptionComponent],
  imports: [
    CommonModule,
    TranslateModule
  ],
  exports: [
    TranslateModule,
    TitleCaptionDirective,
    PlaceholderCaptionDirective,
    CaptionDirective,
    CaptionComponent
  ]
})
export class TranslationsModule { }
