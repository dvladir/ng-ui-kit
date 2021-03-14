import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {CoreModule} from '@vt/core';
import {TranslatePrepareModule} from './modules/translate-prepare/translate-prepare.module';
import { TestModalComponent } from './components/test-modal/test-modal.component';
import {OverlayModule} from '@angular/cdk/overlay';
import { TableExampleComponent } from './pages/table-example/table-example.component';
import { MessagesExampleComponent } from './pages/messages-example/messages-example.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { ListExampleComponent } from './pages/list-example/list-example.component';
import {FormsModule} from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    TestModalComponent,
    TableExampleComponent,
    MessagesExampleComponent,
    ListExampleComponent
  ],
  imports: [
    FormsModule,
    TranslatePrepareModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    CoreModule,
    OverlayModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
