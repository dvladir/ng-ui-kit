import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {TableExampleComponent} from './pages/table-example/table-example.component';
import {MessagesExampleComponent} from './pages/messages-example/messages-example.component';
import {ListExampleComponent} from './pages/list-example/list-example.component';
import {IndicatorExampleComponent} from './pages/indicator-example/indicator-example.component';
import {DateTimeExampleComponent} from './pages/date-time-example/date-time-example.component';
import {MasksExampleComponent} from './pages/masks-example/masks-example.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'table',
    pathMatch: 'full'
  },
  {
    path: 'table',
    component: TableExampleComponent
  }, {
    path: 'messages',
    component: MessagesExampleComponent
  }, {
    path: 'lists',
    component: ListExampleComponent
  }, {
    path: 'indicators',
    component: IndicatorExampleComponent
  }, {
    path: 'dateTime',
    component: DateTimeExampleComponent
  }, {
    path: 'masks',
    component: MasksExampleComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
