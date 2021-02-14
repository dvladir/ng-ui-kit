import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {CoreModule} from '@vt/core';
import {TranslatePrepareModule} from './modules/translate-prepare/translate-prepare.module';
import { TestModalComponent } from './components/test-modal/test-modal.component';
import {OverlayModule} from '@angular/cdk/overlay';

@NgModule({
  declarations: [
    AppComponent,
    TestModalComponent
  ],
  imports: [
    TranslatePrepareModule,
    BrowserModule,
    AppRoutingModule,
    CoreModule,
    OverlayModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
