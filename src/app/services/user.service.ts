import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { map, Observable, throwError, } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private users: User[] = [];
  private url: string = 'http://localhost:8080/api/users';

  constructor(private http:HttpClient) { }

  findAll(): Observable<User[]>{
    return this.http.get<User[]>(this.url);
  }

  findAllPageable(page: number): Observable<any>{
    return this.http.get<any[]>(`${this.url}/page/${page}`);
  }

  findById(id:number): Observable<User>{
    return this.http.get<User>(`${this.url}/${id}`);
  }

  create(user:User): Observable<User> {
    return this.http.post<User>(this.url, user);
  }

  update(user:User): Observable<User>{
    return this.http.put<User>(`${this.url}/${user.id}`, user);
  }

  delete(id:number): Observable<void>{
    return this.http.delete<void>(`${this.url}/${id}`);
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('Error en la API:', error);
    return throwError(error.error || 'Error desconocido');
  }
}
