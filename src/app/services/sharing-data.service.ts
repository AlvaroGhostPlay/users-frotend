import { EventEmitter, Injectable } from '@angular/core';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class SharingDataService {

  constructor() { }

  private _newUserEventEmitter: EventEmitter<User> = new EventEmitter();
  private _idUserEventEmitter = new EventEmitter();
  private _findUserByIdEventEmitter = new EventEmitter();
  private _selectUserEventEmitter: EventEmitter<User> = new EventEmitter();
  private _errorFormEventEmitter = new EventEmitter();
  private _pageUsersEventEmitter = new EventEmitter();

  get NewUserEventEmitter(): EventEmitter<User>{
    return this._newUserEventEmitter;
  }

  get IdUserEventEmitter(): EventEmitter<number>{
    return this._idUserEventEmitter;
  }

  get FindUserByIdEventEmitter(): EventEmitter<number>{
    return this._findUserByIdEventEmitter ;
  }
  get SelectUserEventEmitter(): EventEmitter<User>{
    return this._selectUserEventEmitter  ;
  }

  get ErrorFormEventEmitter(){
    return this._errorFormEventEmitter  ;
  }

  get PageUsersEventEmitter(){
    return this._pageUsersEventEmitter  ;
  }

}
