import {Component, TrackByFunction} from '@angular/core';
import {UtilsService} from '@vt/core';
import {Observable, of} from 'rxjs';

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  middleName: string;
}

@Component({
  selector: 'vta-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(
    private _utils: UtilsService
  ) {
  }

  title = 'test-app';

  readonly userTableColumns: string[] = ['firstName', 'lastName', 'middleName'];

  readonly trackByFn: TrackByFunction<User> = (index, item) => item.id;

  readonly usersData$: Observable<User[]> = of([
    this.createUser('Livy', 'Ainslie', 'MacEntire'),
    this.createUser('Gay', 'Jason', 'Arthurson'),
    this.createUser('Laureen', 'Sherilyn', 'Peak'),
    this.createUser('Varnava', 'Gilroy', 'Weaver'),
    this.createUser('Lorrin', 'Celine', 'Urquhart'),
    this.createUser('Leon', 'Rebeccanne', 'Tollemache'),
    this.createUser('Pelagiya', 'Jennifer', 'Trevis'),
    this.createUser('Blair', 'Labhrainn', 'Ross'),
    this.createUser('Fergus', 'Shell', 'Campbell'),
    this.createUser('Patsy', 'Anzhelina', 'Brandon'),
    this.createUser('Rex', 'Martin', 'Shepherd'),
    this.createUser('Ira', 'Nelli', 'Lockwood'),
    this.createUser('Catrina', 'Roseanne', 'McAlister'),
    this.createUser('Glenda', 'Matilda', 'Drummond'),
    this.createUser('Sondra', 'Victor', 'Paterson'),
    this.createUser('Chadwick', 'Iola', 'Arnold'),
    this.createUser('Allen', 'Shena', 'Outterridge'),
    this.createUser('Catherine', 'Jeannie', 'Brooks'),
    this.createUser('Alan', 'Jayceon', 'Tollemache'),
    this.createUser('Loyd', 'Lynton', 'Conner'),
    this.createUser('Aaren', 'Cathleen', 'Frye'),
    this.createUser('Parker', 'Kimball', 'MacGrory'),
    this.createUser('Brittani', 'Pene', 'Roydon'),
    this.createUser('Kandace', 'Damon', 'Munro'),
    this.createUser('Asya', 'Eilidh', 'Mayes')
  ]);

  private createUser(firstName: string, middleName: string, lastName: string): User {
    const id = this._utils.randomInt();
    return {id, firstName, lastName, middleName};
  }

}
