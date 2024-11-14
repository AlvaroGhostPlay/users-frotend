import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private users: User[] = [{
    id: 1,
    name: 'Alvaro',
    lastname: 'Vásquez',
    email: 'alvarox129.edu@gmail.com',
    username: 'alvaro112',
    password: '1234567'
  },
    {
    id: 2,
    name: 'Eduardo',
    lastname: 'Vásquez',
    email: 'vasquezalvaro346.edu@gmail.com',
    username: 'eduardo112',
    password: '1234567'
  },

    {
    id: 3,
    name: 'Keyla',
    lastname: 'Vásquez',
    email: 'keylau@gmail.com',
    username: 'keyla112',
    password: '1234567'
  }];

  constructor() { }

  findAll(): Observable<User[]>{
    return of(this.users);
  }
}
