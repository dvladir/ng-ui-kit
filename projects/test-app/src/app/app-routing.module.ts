import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {TableExampleComponent} from './pages/table-example/table-example.component';
import {MessagesExampleComponent} from './pages/messages-example/messages-example.component';

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
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
