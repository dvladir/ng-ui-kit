import { BrowserModule } from '@angular/platform-browser';
import {APP_INITIALIZER, NgModule} from '@angular/core';

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
import { IndicatorExampleComponent } from './pages/indicator-example/indicator-example.component';
import {IndicatorIconSetupService} from '../../../vt/core/src/lib/modules/indicator/services/indicator-icon-setup.service';
import { DateTimeExampleComponent } from './pages/date-time-example/date-time-example.component';

@NgModule({
  declarations: [
    AppComponent,
    TestModalComponent,
    TableExampleComponent,
    MessagesExampleComponent,
    ListExampleComponent,
    IndicatorExampleComponent,
    DateTimeExampleComponent
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
  providers: [
/*
    {
      provide: APP_INITIALIZER,
      deps: [IndicatorIconSetupService],
      useFactory: (indicatorIconSetup: IndicatorIconSetupService) => {
        return () => new Promise(resolve => {
          indicatorIconSetup.setup('fa-cog');
          resolve();
        });
      },
      multi: true
    }
*/
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
