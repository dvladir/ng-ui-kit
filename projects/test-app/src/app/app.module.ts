import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {CoreModule} from '@vt/core';
import {TranslatePrepareModule} from './modules/translate-prepare/translate-prepare.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    TranslatePrepareModule,
    BrowserModule,
    AppRoutingModule,
    CoreModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
