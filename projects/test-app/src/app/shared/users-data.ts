import {Utils} from '@dvladir/ng-ui-kit';

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  middleName: string;
}

export const createUser = (firstName: string, middleName: string, lastName: string): User => {
  const id = Utils.randomInt();
  return {id, firstName, lastName, middleName};
};

export const USERS: ReadonlyArray<User> = [
  createUser('Livy', 'Ainslie', 'MacEntire'),
  createUser('Gay', 'Jason', 'Arthurson'),
  createUser('Laureen', 'Sherilyn', 'Peak'),
  createUser('Varnava', 'Gilroy', 'Weaver'),
  createUser('Lorrin', 'Celine', 'Urquhart'),
  createUser('Leon', 'Rebeccanne', 'Tollemache'),
  createUser('Pelagiya', 'Jennifer', 'Trevis'),
  createUser('Blair', 'Labhrainn', 'Ross'),
  createUser('Fergus', 'Shell', 'Campbell'),
  createUser('Patsy', 'Anzhelina', 'Brandon'),
  createUser('Rex', 'Martin', 'Shepherd'),
  createUser('Ira', 'Nelli', 'Lockwood'),
  createUser('Catrina', 'Roseanne', 'McAlister'),
  createUser('Glenda', 'Matilda', 'Drummond'),
  createUser('Sondra', 'Victor', 'Paterson'),
  createUser('Chadwick', 'Iola', 'Arnold'),
  createUser('Allen', 'Shena', 'Outterridge'),
  createUser('Catherine', 'Jeannie', 'Brooks'),
  createUser('Alan', 'Jayceon', 'Tollemache'),
  createUser('Loyd', 'Lynton', 'Conner'),
  createUser('Aaren', 'Cathleen', 'Frye'),
  createUser('Parker', 'Kimball', 'MacGrory'),
  createUser('Brittani', 'Pene', 'Roydon'),
  createUser('Kandace', 'Damon', 'Munro'),
  createUser('Asya', 'Eilidh', 'Mayes')
];


